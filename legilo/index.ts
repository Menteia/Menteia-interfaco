import { Kontrolilo } from "../kontrolilo";

export interface SintaksoArbo {
  radiko: string;
  opcioj: Array<SintaksoArbo>;
}

const longaPaŭzajVortoj = new Set(['brotas', 'premis']);
const paŭzajVortoj = new Set(['luvana']);

export class Legilo {
  constructor(private vortaro: Map<string, [string, number]>) {}

  *vortigi(silaboj: string): IterableIterator<string> {
    let aktuala: Array<string> = [];

    for (const silabo of Kontrolilo.silaboj(silaboj)) {
      aktuala.push(silabo);
      const eblaVorto = aktuala.join("");
      if (this.vortaro.has(eblaVorto)) {
        yield eblaVorto;
        aktuala = [];
      }
    }

    if (aktuala.length > 0) {
      throw new Error("Neuzitaj silabojn: " + aktuala.join(""));
    }
  }

  kompreni(silaboj: string): SintaksoArbo {
    const vortoj = this.vortigi(silaboj.replace(/\s/g, ""));
    const unuaVorto = vortoj.next().value;
    const ano = this.vortaro.get(unuaVorto);
    if (!ano) throw new Error(`Nevalida vorto: ${unuaVorto}`);
    const opcioj = ano[1];
    console.log(`${unuaVorto}/${ano[1]}`);
    return {
      radiko: unuaVorto,
      opcioj: this.konstruiArbon(opcioj, vortoj),
    };
  }

  static *traversi(arbo: SintaksoArbo, {paŭzoj}: {paŭzoj: boolean} = {paŭzoj: false}): IterableIterator<string> {
    if (paŭzoj) {
      if (longaPaŭzajVortoj.has(arbo.radiko)) {
        yield "!longapaŭzo";
      }
    }
    yield arbo.radiko;
    let i = 0;
    for (const subarbo of arbo.opcioj) {
      yield* Legilo.traversi(subarbo, {paŭzoj});
      if (paŭzoj) {
        if (paŭzajVortoj.has(arbo.radiko) && i < arbo.opcioj.length - 1) {
          yield "!paŭzo";
        }
      }
      ++i;
    }
  }

  private konstruiArbon(opcioj: number, vortoj: IterableIterator<string>): Array<SintaksoArbo> {
    return Array.from({ length: opcioj }, (_) => {
      const sekva = vortoj.next();
      if (sekva.done) throw new Error ("Ne estas plu da vortoj");
      const sekvaVorto = sekva.value;
      const ano = this.vortaro.get(sekvaVorto);
      if (!ano) throw new Error(`Nevalida vorto: ${sekvaVorto}`);
      console.log(`${sekvaVorto}/${ano[1]}`);
      return {
        radiko: sekvaVorto,
        opcioj: this.konstruiArbon(ano[1], vortoj),
      };
    });
  }
}
