const konsonantoj1 = new Set<string>("p b t d k g f".split(" "));
const konsonantoj2 = new Set<string>("r l".split(" "));
const konsonantoj3 = new Set<string>("m n v s ʃ".split(" "));
const vokaloj = new Set<string>("a e i o u".split(" "));
const finoj = new Set<string>("m n s".split(" "));

export class Kontrolilo {
  constructor(private vortaro: Map<string, [string, number]>) {}

  validas(novaVorto: string): boolean {
    for (const vorto of this.vortaro.keys()) {
      if (
        vorto.startsWith(novaVorto) ||
        novaVorto.startsWith(vorto) ||
        vorto.endsWith(novaVorto) ||
        novaVorto.endsWith(vorto)
      ) {
        return false;
      }
    }
    return true;
  }

  *silaboj(vorto: string): IterableIterator<string> {
    const aŭtomato = new FiniaAŭtomato();
    let aktuala: Array<string> = [];
    let i = 0;
    for (const litero of vorto) {
      if (aŭtomato.ĉuFinita()) {
        if (finoj.has(litero)) {
          if (!vokaloj.has(vorto[i+1])) {
            aktuala.push(litero);
            yield aktuala.join("");
            aktuala = [];
          } else {
            yield aktuala.join("");
            aŭtomato.restartigi();
            aŭtomato.movi(litero);
            aktuala = [litero];
          }
          ++i;
          continue;
        }
        yield aktuala.join("");
        aktuala = [];
        aŭtomato.restartigi();
      }
      aŭtomato.movi(litero);
      aktuala.push(litero);
      ++i;
    }
    if (!aŭtomato.ĉuFinita()) {
      throw new Error(`Neuzitaj literoj: ${aktuala.join("")}`);
    }
    if (aktuala.length > 0) {
      yield aktuala.join("");
    }
  }
}

type literoTipo = "vokalo" | "k1" | "k2" | "k3" | "fino" | "nenio" | "nasala";
type stato = "malplena" | "k1" | "k2" | "k3" | "k1k2" | "k1k2V" | "k1V" | "k2V" | "k3V";

const finajStatoj = new Set<stato>(["k1k2V", "k1V", "k2V", "k3V"]);

const transiroj: { [S in stato]?: { [L in literoTipo]?: stato } } = {
  "malplena": {
    k1: "k1",
    k2: "k2",
    k3: "k3",
    nasala: "k2",
  },
  "k1": {
    k2: "k1k2",
    vokalo: "k1V",
  },
  "k2": {
    vokalo: "k2V",
  },
  "k3": {
    vokalo: "k3V",
  },
  "k1k2": {
    vokalo: "k1k2V",
  }
};

class FiniaAŭtomato {
  private stato: stato;

  constructor() {
    this.stato = "malplena";
  }

  restartigi() {
    this.stato = "malplena";
  }

  movi(novaLitero: string) {
    const tipo = FiniaAŭtomato.tipo(novaLitero);
    const sekvaj = transiroj[this.stato];
    if (sekvaj) {
      const novaStato = sekvaj[tipo];
      if (novaStato) {
        this.stato = novaStato;
      } else {
        throw new Error(`Nevalida transiro de ${this.stato} per ${novaLitero} de tipo ${tipo}`);
      }
    }
  }

  ĉuPovasMovi(novaLitero: string): boolean {
    const tipo = FiniaAŭtomato.tipo(novaLitero);
    const sekvaj = transiroj[this.stato];
    if (sekvaj) {
      const sekva = sekvaj[tipo];
      if (sekva) {
        return true;
      }
    }
    return false;
  }

  ĉuFinita(): boolean {
    return finajStatoj.has(this.stato);
  }

  private static tipo(litero: string): literoTipo {
    if (konsonantoj1.has(litero)) {
      return "k1";
    } else if (konsonantoj2.has(litero)) {
      return "k2";
    } else if (konsonantoj3.has(litero)) {
      if (finoj.has(litero)) {
        return "nasala";
      }
      return "k3";
    } else if (vokaloj.has(litero)) {
      return "vokalo";
    } else if (finoj.has(litero)) {
      return "fino";
    } else {
      return "nenio";
    }
  }
}