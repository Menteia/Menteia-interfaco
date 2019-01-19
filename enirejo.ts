import { config } from "dotenv";
config();

import * as readline from "readline";
import * as inquirer from "inquirer";
import moment from "moment";

import { legiDosieron, konserviDosieron } from "./vortaro";
import { Legilo } from "./legilo";
import { Kontrolilo } from "./kontrolilo";
import { paroli } from "./polly";
import { respondi } from "./cerbo";

interface Respondo {
  eniro: string;
}

legiDosieron().then(vortaro => {
  const kontrolilo = new Kontrolilo(vortaro);
  const legilo = new Legilo(vortaro);

  const eniri = () => {
    inquirer
      .prompt<Respondo>([
        {
          name: "eniro",
          message: ">"
        }
      ])
      .then(({ eniro }) => {
        const partoj = eniro.split(" ");
        switch (partoj[0]) {
          case "aldoni":
            const vorto = partoj[1];
            if (vorto == null) {
              console.log("Nevalida aldono");
              break;
            }
            if (vortaro.has(vorto)) {
              console.log(`La vorto ${vorto} jam ekzistas.`);
            } else {
              if (kontrolilo.validas(vorto)) {
                vortaro.set(vorto, [partoj[2], parseInt(partoj[3])]);
                konserviDosieron(vortaro);
              } else {
                console.log(`${vorto} ne estas valida.`);
              }
            }
            break;
          case "eliri":
            return;
          case "paroli":
            const arbo = legilo.kompreni(partoj.slice(1).join(""));
            paroli(arbo, partoj.slice(1).join(" ") + ".ogg");
            break;
          default:
            respondi(legilo.kompreni(eniro)).then((respondo) => {
              paroli(respondo, moment().format('YYYY-MM-DD HHmmss') + ".ogg");
            });
            break;
        }
        eniri();
      });
  };
  eniri();
});
