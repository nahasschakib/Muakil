import * as XLSX from "xlsx";

export function generateCGNCTemplate(): Buffer {
  const workbook = XLSX.utils.book_new();

  // ── Onglet 1 : Balance Générale ──
  const balanceData = [
    // En-têtes
    ["N° Compte", "Intitulé du compte", "Débit (MAD)", "Crédit (MAD)", "Solde (MAD)"],
    // Séparateur Classe 1
    ["--- CLASSE 1 : COMPTES DE FINANCEMENT PERMANENT ---", "", "", "", ""],
    ["1111", "Capital social", "", "700 000", ""],
    ["1120", "Réserve légale", "", "50 000", ""],
    ["1191", "Résultat net de l'exercice", "", "280 000", ""],
    ["1411", "Emprunts auprès des établissements de crédit", "", "300 000", ""],
    // Classe 2
    ["--- CLASSE 2 : COMPTES D'ACTIF IMMOBILISÉ ---", "", "", "", ""],
    ["2321", "Matériel informatique", "120 000", "", ""],
    ["2331", "Mobilier de bureau", "80 000", "", ""],
    ["2355", "Logiciels", "50 000", "", ""],
    ["2390", "Amortissements cumulés", "", "50 000", ""],
    // Classe 3
    ["--- CLASSE 3 : COMPTES D'ACTIF CIRCULANT ---", "", "", "", ""],
    ["3111", "Stocks de marchandises", "80 000", "", ""],
    ["3421", "Clients et comptes rattachés", "200 000", "", ""],
    ["3441", "Personnel débiteur", "5 000", "", ""],
    ["3516", "TVA récupérable sur charges", "12 000", "", ""],
    // Classe 4
    ["--- CLASSE 4 : COMPTES DE PASSIF CIRCULANT ---", "", "", "", ""],
    ["4411", "Fournisseurs et comptes rattachés", "85 000", "", ""],
    ["4432", "Personnel - rémunérations dues", "45 000", "", ""],
    ["4455", "État - TVA facturée", "30 000", "", ""],
    ["4456", "État - IS dû", "25 000", "", ""],
    // Classe 5
    ["--- CLASSE 5 : COMPTES DE TRÉSORERIE ---", "", "", "", ""],
    ["5141", "Banques - CIH", "120 000", "", ""],
    ["5142", "Banques - Attijariwafa", "30 000", "", ""],
    ["5161", "Caisse principale", "5 000", "", ""],
    // Classe 6
    ["--- CLASSE 6 : COMPTES DE CHARGES ---", "", "", "", ""],
    ["6111", "Achats de marchandises", "250 000", "", ""],
    ["6141", "Locations et charges locatives", "72 000", "", ""],
    ["6161", "Assurances", "18 000", "", ""],
    ["6171", "Études et recherches", "35 000", "", ""],
    ["6181", "Documentation", "8 000", "", ""],
    ["6191", "Transports", "15 000", "", ""],
    ["6194", "Déplacements et missions", "22 000", "", ""],
    ["6196", "Frais de télécommunications", "12 000", "", ""],
    ["6211", "Rémunérations du personnel", "280 000", "", ""],
    ["6271", "Charges sociales", "85 000", "", ""],
    ["6311", "Impôts et taxes (hors IS)", "18 000", "", ""],
    ["6332", "Dotations aux amortissements", "35 000", "", ""],
    // Classe 7
    ["--- CLASSE 7 : COMPTES DE PRODUITS ---", "", "", "", ""],
    ["7111", "Ventes de marchandises", "", "850 000", ""],
    ["7121", "Ventes de biens produits", "", "200 000", ""],
    ["7131", "Ventes de services", "", "150 000", ""],
    ["7381", "Produits des titres de participation", "", "8 000", ""],
    ["7391", "Gains de change", "", "2 000", ""],
  ];

  const balanceSheet = XLSX.utils.aoa_to_sheet(balanceData);

  // Style colonnes
  balanceSheet["!cols"] = [
    { wch: 15 }, { wch: 45 }, { wch: 18 }, { wch: 18 }, { wch: 18 },
  ];

  XLSX.utils.book_append_sheet(workbook, balanceSheet, "Balance Générale");

  // ── Onglet 2 : Instructions ──
  const instructionsData = [
    ["GUIDE D'UTILISATION — TEMPLATE BALANCE CGNC MUAKIL", "", ""],
    ["", "", ""],
    ["ÉTAPE 1 — EXPORTER DEPUIS VOTRE LOGICIEL COMPTABLE", "", ""],
    ["Sage Comptabilité :", "Édition > Balance > Export Excel", ""],
    ["Ciel Comptabilité :", "Impressions > Balance > Exporter en Excel", ""],
    ["DIOT :", "États financiers > Balance générale > Télécharger", ""],
    ["Microsoft Excel :", "Ouvrez votre fichier et copiez les colonnes dans l'onglet Balance", ""],
    ["", "", ""],
    ["ÉTAPE 2 — COLLER VOS DONNÉES", "", ""],
    ["", "Remplacez les exemples de l'onglet 'Balance Générale' par vos données réelles", ""],
    ["", "Respectez le format : N° Compte | Intitulé | Débit | Crédit", ""],
    ["", "Les soldes sont calculés automatiquement par Amine", ""],
    ["", "", ""],
    ["ÉTAPE 3 — IMPORTER DANS AMINE", "", ""],
    ["", "Enregistrez le fichier en .xlsx ou .csv", ""],
    ["", "Uploadez-le dans le Studio Amine > Import fichier", ""],
    ["", "Amine calcule automatiquement tous vos ratios financiers", ""],
    ["", "", ""],
    ["FORMAT DES NUMÉROS DE COMPTES CGNC", "", ""],
    ["Classe 1", "Financement permanent (capitaux propres, emprunts LT)", ""],
    ["Classe 2", "Actif immobilisé (immobilisations, amortissements)", ""],
    ["Classe 3", "Actif circulant (stocks 31-35, créances 34-39)", ""],
    ["Classe 4", "Passif circulant (fournisseurs, État, personnel)", ""],
    ["Classe 5", "Trésorerie (banques, caisse, CCP)", ""],
    ["Classe 6", "Charges d'exploitation", ""],
    ["Classe 7", "Produits d'exploitation (CA, produits financiers)", ""],
    ["", "", ""],
    ["IMPORTANT", "Ne modifiez pas les en-têtes de colonnes", ""],
    ["", "Les lignes de séparation (---) sont ignorées automatiquement", ""],
    ["", "Montants en MAD (Dirhams), sans symbole", ""],
  ];

  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData);
  instructionsSheet["!cols"] = [{ wch: 25 }, { wch: 60 }, { wch: 20 }];

  XLSX.utils.book_append_sheet(workbook, instructionsSheet, "Instructions");

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
