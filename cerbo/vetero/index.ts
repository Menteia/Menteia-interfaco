import * as request from "request";

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
  return `https://api.openweathermap.org/data/2.5/forecast?id=${loko}&appid=${process.env.OPENWEATHERMAP_API_KEY}`;
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
      let vetero = null;
      for (const ano of datumo.list) {
        if (dato.isSame(ano.dt_txt, "hour")) {
          vetero = ano;
          break;
        }
      }
      if (!vetero) {
        throw new Error(datoNomo.radiko);
      }
      const lumina = kodoj[vetero.weather[0].id];
      const respondoTeksto = `sagi peras tres ${Array.from(Legilo.traversi(datoNomo)).join(" ")} gesmi
brotas to bis lumina gesmi ${lumina}
brotas to besra ʃevara nevum ${kreiVortojn(vetero.main.temp - 273)}
brotas to besra ferana posetim ${kreiVortojn(vetero.wind.speed * 3.6)}
premis`;
      console.log(respondoTeksto);
      akcepti(legilo.kompreni(respondoTeksto));
    });
  });
});