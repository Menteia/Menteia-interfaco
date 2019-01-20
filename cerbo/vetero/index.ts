import * as request from "request";
import moment from "moment";

import { aldoni, trovi } from "../";
import { legiDaton, kreiVortojn } from "../iloj";
import { legiDosieron } from "../../vortaro";
import { Legilo } from "../../legilo";
import { kodoj } from "./kodoj";

interface Raportano {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  snow: {
    "3h": number;
  };
  rain: {
    "3h": number;
  };
  dt_txt: string;
}

interface Respondo {
  list: Array<Raportano>;
}

const urboj = new Map<string, number>([
  ["sitana", 6176823], // Waterloo, ON
]);

function estontaURL(loko: number): string {
  return `https://api.openweathermap.org/data/2.5/forecast?id=${loko}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`;
}

function aktualaURL(loko: number) {
  return `https://api.openweathermap.org/data/2.5/weather?id=${loko}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`;
}

aldoni("lurina", async ([datoNomo, lokoNomo]) => {
  const loko = urboj.get(lokoNomo.radiko);
  if (!loko) {
    throw new Error(lokoNomo.radiko);
  }
  const vortaro = await legiDosieron();
  const legilo = new Legilo(vortaro);
  const dato = legiDaton(datoNomo).hour(12);
  return new Promise((akcepti, malakepti) => {
    request.get(estontaURL(loko), (eraro, respondo, korpo) => {
      const datumo: Respondo = JSON.parse(korpo);
      const teksto = kreiRaporton(dato, datumo);
      if (teksto == null) {
        throw new Error(`Neniu datumo por ${dato.format()}`);
      }
      console.log(teksto);
      akcepti(legilo.kompreni(`sagi to lurina ${Array.from(Legilo.traversi(datoNomo)).join(" ")} ${lokoNomo.radiko} ${teksto}`));
    });
  });
});

aldoni("lemona", async ([lokoNomo]) => {
  const loko = urboj.get(lokoNomo.radiko);
  if (!loko) {
    throw new Error(lokoNomo.radiko);
  }
  const vortaro = await legiDosieron();
  const legilo = new Legilo(vortaro);
  return new Promise((akcepti, malakepti) => {
    request.get(aktualaURL(loko), (eraro, respondo, korpo) => {
      const datumo: Raportano = JSON.parse(korpo);
      const teksto = kreiAktualanRaporton(datumo);
      if (teksto == null) {
        throw new Error(`Neniu datumo por hodiaŭ`);
      }
      console.log(teksto);
      akcepti(legilo.kompreni(`sagi to lemona ${lokoNomo.radiko} ${teksto}`));
    });
  });
});

function kreiAktualanRaporton(datumo: Raportano): string {
  const lumina = kodoj[datumo.weather[0].id];
  return `luvana ${lumina} nevum ${kreiVortojn(datumo.main.temp)} posetim ${kreiVortojn(datumo.wind.speed * 3.6)}`;
}

function kreiRaporton(dato: moment.Moment, datumo: Respondo): string | null {
  let vetero = null;
  for (const ano of datumo.list) {
    if (dato.isSame(ano.dt_txt, "hour")) {
      vetero = ano;
      break;
    }
  }
  if (vetero == null) return null;
  const lumina = kodoj[vetero.weather[0].id];
  const raporto = [`luvana ${lumina} nevum ${kreiVortojn(vetero.main.temp)} posetim ${kreiVortojn(vetero.wind.speed * 3.6)}`];

  let pluvo = 0;
  let neĝo = 0;
  for (const ano of datumo.list) {
    if (dato.isSame(ano.dt_txt, "day")) {
      if (ano.rain && ano.rain["3h"]) {
        pluvo += ano.rain["3h"];
      }
      if (ano.snow && ano.snow["3h"]) {
        neĝo += ano.snow["3h"];
      }
    }
  }

  if (pluvo > 0) {
    raporto.push(`vem saleri glima senam ${kreiVortojn(pluvo * 3)}`);
  }
  if (neĝo > 0) {
    raporto.push(`vem varumi glima senam ${kreiVortojn(neĝo * 3)}`);
  }

  if (raporto.length === 1) {
    return raporto[0];
  } else {
    return `brotas ${raporto.join(" brotas ")} premis`;
  }
}