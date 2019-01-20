import moment from "moment";

import { SintaksoArbo } from "../legilo";

export function legiDaton(arbo: SintaksoArbo): moment.Moment {
  switch (arbo.radiko) {
    case "fitam":
      return fitam(arbo.opcioj);
    default:
      throw new Error(arbo.radiko);
  }
}

export function legiNombron(arbo: SintaksoArbo): number {
  switch (arbo.radiko) {
    case "mora":
      return 0;
    case "pona":
      return 1;
    case "fora":
      return 2;
    case "nora":
      return 3;
    case "tega":
      return 4;
    case "sira":
      return 5;
    case "lina":
      return 6;
    case "ʃona":
      return 7;
    case "kera":
      return 8;
    case "gina":
      return 9;
    case "poni":
      return parseFloat(`1${legiNombron(arbo.opcioj[0])}`);
    case "fori":
      return parseFloat(`2${legiNombron(arbo.opcioj[0])}`);
    case "nori":
      return parseFloat(`3${legiNombron(arbo.opcioj[0])}`);
    case "tegi":
      return parseFloat(`4${legiNombron(arbo.opcioj[0])}`);
    case "siri":
      return parseFloat(`5${legiNombron(arbo.opcioj[0])}`);
    case "lini":
      return parseFloat(`6${legiNombron(arbo.opcioj[0])}`);
    case "ʃoni":
      return parseFloat(`7${legiNombron(arbo.opcioj[0])}`);
    case "keri":
      return parseFloat(`8${legiNombron(arbo.opcioj[0])}`);
    case "gini":
      return parseFloat(`9${legiNombron(arbo.opcioj[0])}`);
    case "gulos":
      return -legiNombron(arbo.opcioj[1]);
    default:
      throw new Error(arbo.radiko);
  }
}

const nombroj1 = ["mora", "pona", "fora", "nora", "tega", "sira", "lina", "ʃona", "kera", "gina"];
const nombroj2 = ["mori", "poni", "fori", "nori", "tegi", "siri", "lini", "ʃoni", "keri", "gini"];
export function kreiVortojn(nombro: number): string {
  const vortoj: Array<string> = [];
  nombro = Math.round(nombro);
  const gulos = nombro < 0;
  nombro = Math.abs(nombro);
  while (nombro >= 10) {
    const cifero = nombro % 10;
    vortoj.unshift((vortoj.length === 0 ? nombroj1 : nombroj2)[cifero]);
    nombro /= 10;
  }
  vortoj.unshift((vortoj.length === 0 ? nombroj1 : nombroj2)[Math.floor(nombro)]);
  if (gulos) {
    vortoj.unshift("gulos");
  }
  return vortoj.join(" ");
}

function fitam([opcio] : Array<SintaksoArbo>): moment.Moment {
  const nombro = legiNombron(opcio);
  return moment().startOf('day').add(nombro, 'days');
}