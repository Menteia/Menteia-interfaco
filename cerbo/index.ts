import { SintaksoArbo } from "../legilo";

type Respondilo = (opcioj: Array<SintaksoArbo>) => Promise<SintaksoArbo>;

const respondiloj: Map<string, Respondilo> = new Map<string, Respondilo>();
respondiloj.set("keli", ([opcio]) => {
  const sekva = respondiloj.get(opcio.radiko);
  if (!sekva) throw new Error(opcio.radiko);
  return sekva(opcio.opcioj);
});

export async function respondi(eniro: SintaksoArbo): Promise<SintaksoArbo> {
  try {
    const sekva = respondiloj.get(eniro.radiko);
    if (!sekva) throw new Error(eniro.radiko);
    return sekva(eniro.opcioj);
  } catch (e) {
    console.error(e);
    return {
      radiko: "veguna",
      opcioj: []
    };
  }
}

export function aldoni(vorto: string, respondilo: Respondilo) {
  respondiloj.set(vorto, respondilo);
}

export function trovi(vorto: string): Respondilo | undefined {
  return respondiloj.get(vorto);
}

import "./vetero";