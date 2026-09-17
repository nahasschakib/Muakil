import * as XLSX from "xlsx";

export type CGNCData = {
  // Compte de résultat
  ca: number;
  chargesExploitation: number;
  resultatNet: number;
  // Bilan actif
  immobilisations: number;
  stocks: number;
  creances: number;
  tresorerie: number;
  // Bilan passif
  capitauxPropres: number;
  dettesLT: number;
  dettesCT: number;
  dettes: number;
  // Détail classes
  classes: Record<string, number>;
  // Comptes détaillés
  comptes: Array<{ numero: string; intitule: string; solde: number; classe: string }>;
  erreurs: string[];
};

type BalanceLine = {
  numero: string;
  intitule: string;
  debit: number;
  credit: number;
  solde: number;
};

function getClasse(numero: string): string {
  return numero.charAt(0);
}

function parseSolde(debit: number, credit: number, numero: string): number {
  const classe = getClasse(numero);
  // Classes 1, 4 (passif), 7 (produits) : solde créditeur = positif en négatif
  // Classes 2, 3, 5, 6 (actif, charges) : solde débiteur = positif
  if (["1", "4", "7"].includes(classe)) {
    return credit - debit;
  }
  return debit - credit;
}

function parseNumber(val: unknown): number {
  if (val === null || val === undefined || val === "") return 0;
  const num = typeof val === "number" ? val : parseFloat(String(val).replace(/\s/g, "").replace(",", "."));
  return isNaN(num) ? 0 : num;
}

function parseBalanceRows(rows: unknown[][]): BalanceLine[] {
  const lines: BalanceLine[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 3) continue;

    const numero = String(row[0] ?? "").trim();
    if (!numero || !/^\d/.test(numero)) continue;

    const intitule = String(row[1] ?? "").trim();
    const debit = parseNumber(row[2]);
    const credit = parseNumber(row[3] ?? 0);
    const soldeRaw = row[4] !== undefined ? parseNumber(row[4]) : debit - credit;

    lines.push({ numero, intitule, debit, credit, solde: soldeRaw });
  }

  return lines;
}

function aggregateClasses(lines: BalanceLine[]): Record<string, number> {
  const classes: Record<string, number> = {
    "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0,
  };

  for (const line of lines) {
    const classe = getClasse(line.numero);
    if (classes[classe] !== undefined) {
      const solde = parseSolde(line.debit, line.credit, line.numero);
      classes[classe] += solde;
    }
  }

  return classes;
}

function extractAggregats(lines: BalanceLine[], classes: Record<string, number>): Omit<CGNCData, "classes" | "comptes" | "erreurs"> {
  // CA = Classe 7 (produits d'exploitation, comptes 71xx prioritairement)
  const ca = lines
    .filter((l) => l.numero.startsWith("71") || l.numero.startsWith("7"))
    .reduce((sum, l) => sum + parseSolde(l.debit, l.credit, l.numero), 0);

  // Charges = Classe 6
  const chargesExploitation = Math.abs(classes["6"]);

  // Résultat = CA - Charges (simplifié)
  const resultatNet = ca - chargesExploitation;

  // Immobilisations = Classe 2
  const immobilisations = Math.abs(classes["2"]);

  // Stocks = Classe 3 (31xx à 35xx)
  const stocks = lines
    .filter((l) => l.numero.match(/^3[1-5]/))
    .reduce((sum, l) => sum + Math.abs(parseSolde(l.debit, l.credit, l.numero)), 0);

  // Créances = Classe 3 (34xx, 35xx clients)
  const creances = lines
    .filter((l) => l.numero.match(/^3[4-9]/))
    .reduce((sum, l) => sum + Math.abs(parseSolde(l.debit, l.credit, l.numero)), 0);

  // Trésorerie = Classe 5
  const tresorerie = Math.abs(classes["5"]);

  // Capitaux propres = Classe 1 (11xx à 15xx)
  const capitauxPropres = lines
    .filter((l) => l.numero.match(/^1[1-5]/))
    .reduce((sum, l) => sum + Math.abs(parseSolde(l.debit, l.credit, l.numero)), 0);

  // Dettes LT = Classe 1 (14xx-16xx emprunts)
  const dettesLT = lines
    .filter((l) => l.numero.match(/^1[4-6]/))
    .reduce((sum, l) => sum + Math.abs(parseSolde(l.debit, l.credit, l.numero)), 0);

  // Dettes CT = Classe 4
  const dettesCT = Math.abs(classes["4"]);

  const dettes = dettesLT + dettesCT;

  return {
    ca, chargesExploitation, resultatNet,
    immobilisations, stocks, creances, tresorerie,
    capitauxPropres, dettesLT, dettesCT, dettes,
  };
}

export function parseBalanceXLSX(buffer: ArrayBuffer): CGNCData {
  const erreurs: string[] = [];

  try {
    const workbook = XLSX.read(buffer, { type: "array" });

    // Chercher l'onglet Balance (premier onglet ou onglet nommé "Balance")
    const sheetName =
      workbook.SheetNames.find((n) => n.toLowerCase().includes("balance")) ??
      workbook.SheetNames[0];

    if (!sheetName) {
      erreurs.push("Aucun onglet trouvé dans le fichier");
      return getEmptyCGNCData(erreurs);
    }

    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 }) as unknown[][];

    if (rows.length < 2) {
      erreurs.push("Le fichier semble vide ou mal formaté");
      return getEmptyCGNCData(erreurs);
    }

    const lines = parseBalanceRows(rows);

    if (lines.length === 0) {
      erreurs.push("Aucune ligne comptable trouvée — vérifiez le format (N° Compte | Intitulé | Débit | Crédit)");
      return getEmptyCGNCData(erreurs);
    }

    const classes = aggregateClasses(lines);
    const aggregats = extractAggregats(lines, classes);

    const comptes = lines.map((l) => ({
      numero: l.numero,
      intitule: l.intitule,
      solde: parseSolde(l.debit, l.credit, l.numero),
      classe: getClasse(l.numero),
    }));

    return { ...aggregats, classes, comptes, erreurs };
  } catch (err) {
    erreurs.push(`Erreur de parsing : ${String(err)}`);
    return getEmptyCGNCData(erreurs);
  }
}

export function parseBalanceCSV(text: string): CGNCData {
  const erreurs: string[] = [];

  try {
    const workbook = XLSX.read(text, { type: "string" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 }) as unknown[][];

    const lines = parseBalanceRows(rows);

    if (lines.length === 0) {
      erreurs.push("Aucune ligne comptable trouvée dans le CSV");
      return getEmptyCGNCData(erreurs);
    }

    const classes = aggregateClasses(lines);
    const aggregats = extractAggregats(lines, classes);

    const comptes = lines.map((l) => ({
      numero: l.numero,
      intitule: l.intitule,
      solde: parseSolde(l.debit, l.credit, l.numero),
      classe: getClasse(l.numero),
    }));

    return { ...aggregats, classes, comptes, erreurs };
  } catch (err) {
    erreurs.push(`Erreur CSV : ${String(err)}`);
    return getEmptyCGNCData(erreurs);
  }
}

function getEmptyCGNCData(erreurs: string[]): CGNCData {
  return {
    ca: 0, chargesExploitation: 0, resultatNet: 0,
    immobilisations: 0, stocks: 0, creances: 0, tresorerie: 0,
    capitauxPropres: 0, dettesLT: 0, dettesCT: 0, dettes: 0,
    classes: {}, comptes: [], erreurs,
  };
}
