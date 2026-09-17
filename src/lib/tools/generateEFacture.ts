import { createHash } from "crypto";

export type EFactureData = {
  emetteur: {
    ice: string;
    if: string;
    rc: string;
    raisonSociale: string;
    adresse: string;
    ville: string;
  };
  client: {
    ice?: string;
    raisonSociale: string;
    adresse?: string;
    ville?: string;
  };
  facture: {
    numero: string;
    date: string;
    echeance: string;
    devise: string;
  };
  lignes: Array<{
    designation: string;
    quantite: number;
    prixUnitaireHT: number;
    tauxTVA: number;
    montantHT: number;
    montantTVA: number;
    montantTTC: number;
  }>;
  totaux: {
    totalHT: number;
    totalTVA: number;
    totalTTC: number;
    retenuSource?: number;
    netAPayer: number;
  };
};

export function generateHash(data: EFactureData): string {
  const str = [
    data.emetteur.ice,
    data.client.ice || data.client.raisonSociale,
    data.facture.numero,
    data.facture.date,
    data.totaux.totalHT.toFixed(2),
    data.totaux.totalTVA.toFixed(2),
    data.totaux.totalTTC.toFixed(2),
  ].join("|");

  return createHash("sha256").update(str).digest("hex").slice(0, 16).toUpperCase();
}

export function generateQRData(data: EFactureData): string {
  const hash = generateHash(data);
  const params = new URLSearchParams({
    ice: data.emetteur.ice || "",
    if: data.emetteur.if || "",
    num: data.facture.numero,
    date: data.facture.date,
    ht: data.totaux.totalHT.toFixed(2),
    tva: data.totaux.totalTVA.toFixed(2),
    ttc: data.totaux.totalTTC.toFixed(2),
    net: data.totaux.netAPayer.toFixed(2),
    hash,
  });
  return `MUAKIL-EFACTURE:${params.toString()}`;
}

export function generateXML(data: EFactureData): string {
  const hash = generateHash(data);
  const now = new Date().toISOString();

  const lignesXML = data.lignes
    .map(
      (l, i) => `
    <LigneFacture numero="${i + 1}">
      <Designation>${escapeXML(l.designation)}</Designation>
      <Quantite>${l.quantite}</Quantite>
      <PrixUnitaireHT>${l.prixUnitaireHT.toFixed(2)}</PrixUnitaireHT>
      <TauxTVA>${l.tauxTVA}</TauxTVA>
      <MontantHT>${l.montantHT.toFixed(2)}</MontantHT>
      <MontantTVA>${l.montantTVA.toFixed(2)}</MontantTVA>
      <MontantTTC>${l.montantTTC.toFixed(2)}</MontantTTC>
    </LigneFacture>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<Facture xmlns="urn:ma:dgi:efacture:1.0" version="1.0">
  <Entete>
    <NumeroFacture>${escapeXML(data.facture.numero)}</NumeroFacture>
    <DateEmission>${data.facture.date}</DateEmission>
    <DateEcheance>${data.facture.echeance}</DateEcheance>
    <Devise>${data.facture.devise}</Devise>
    <TypeFacture>FA</TypeFacture>
    <HashIntegrite>${hash}</HashIntegrite>
    <DateGeneration>${now}</DateGeneration>
    <Plateforme>MUAKIL-v1</Plateforme>
  </Entete>
  <Emetteur>
    <ICE>${escapeXML(data.emetteur.ice)}</ICE>
    <IF>${escapeXML(data.emetteur.if)}</IF>
    <RC>${escapeXML(data.emetteur.rc)}</RC>
    <RaisonSociale>${escapeXML(data.emetteur.raisonSociale)}</RaisonSociale>
    <Adresse>${escapeXML(data.emetteur.adresse)}</Adresse>
    <Ville>${escapeXML(data.emetteur.ville)}</Ville>
  </Emetteur>
  <Client>
    ${data.client.ice ? `<ICE>${escapeXML(data.client.ice)}</ICE>` : ""}
    <RaisonSociale>${escapeXML(data.client.raisonSociale)}</RaisonSociale>
    ${data.client.adresse ? `<Adresse>${escapeXML(data.client.adresse)}</Adresse>` : ""}
    ${data.client.ville ? `<Ville>${escapeXML(data.client.ville)}</Ville>` : ""}
  </Client>
  <LignesFacture>${lignesXML}
  </LignesFacture>
  <Totaux>
    <TotalHT>${data.totaux.totalHT.toFixed(2)}</TotalHT>
    <TotalTVA>${data.totaux.totalTVA.toFixed(2)}</TotalTVA>
    <TotalTTC>${data.totaux.totalTTC.toFixed(2)}</TotalTTC>
    ${data.totaux.retenuSource ? `<RetenuSource>${data.totaux.retenuSource.toFixed(2)}</RetenuSource>` : ""}
    <NetAPayer>${data.totaux.netAPayer.toFixed(2)}</NetAPayer>
  </Totaux>
</Facture>`;
}

function escapeXML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
