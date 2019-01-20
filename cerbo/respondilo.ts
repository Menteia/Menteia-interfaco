import { SintaksoArbo } from "../legilo";

export type Respondfunkcio = (opcioj: Array<SintaksoArbo>) => Promise<SintaksoArbo>;

export class Respondilo {
  private funkcioj: Map<string, Respondfunkcio>;

  constructor(private vorto: string, private kvanto: number) {
    this.funkcioj = new Map();
  }

  respondi(opcio: Array<SintaksoArbo>): Promise<SintaksoArbo> {
    if (opcio.length !== this.kvanto) {
      throw new Error(`Nevalidaj opcioj por ${this.vorto}`);
    }
  }
}