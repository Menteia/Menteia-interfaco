import { Kontrolilo } from "../kontrolilo";

export interface SintaksoArbo {
  radiko: string;
  opcioj: Array<SintaksoArbo>;
}

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
  }

  kompreni(silaboj: string): SintaksoArbo {
    const vortoj = this.vortigi(silaboj);
    const unuaVorto = vortoj.next().value;
    const ano = this.vortaro.get(unuaVorto);
    if (!ano) throw new Error(`Nevalida vorto: ${unuaVorto}`);
    const opcioj = ano[1];
    return {
      radiko: unuaVorto,
      opcioj: this.konstruiArbon(opcioj, vortoj),
    };
  }

  private konstruiArbon(opcioj: number, vortoj: IterableIterator<string>): Array<SintaksoArbo> {
    return Array.from({ length: opcioj }, (_) => {
      const sekvaVorto = vortoj.next().value;
      const ano = this.vortaro.get(sekvaVorto);
      if (!ano) throw new Error(`Nevalida vorto: ${sekvaVorto}`);
      return {
        radiko: sekvaVorto,
        opcioj: this.konstruiArbon(ano[1], vortoj),
      };
    });
  }
}
