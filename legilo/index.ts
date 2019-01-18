import { Kontrolilo } from "../kontrolilo";

export class Legilo {
  constructor(private vortaro: Map<string, [string, number]>) {}

  *vortigi(silaboj: string): IterableIterator<string> {
    const kontrolilo = new Kontrolilo(this.vortaro);
    let aktuala: Array<string> = [];

    for (const silabo of kontrolilo.silaboj(silaboj)) {
      aktuala.push(silabo);
      const eblaVorto = aktuala.join("")
      if (this.vortaro.has(eblaVorto)) {
        yield eblaVorto;
        aktuala = [];
      }
    }
  }
}