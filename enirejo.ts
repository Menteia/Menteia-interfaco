import * as readline from "readline";
import * as inquirer from "inquirer";

import { legiDosieron, konserviDosieron } from "./vortaro";
import { Kontrolilo } from "./kontrolilo";

interface Respondo {
  eniro: string;
}

legiDosieron().then(vortaro => {
  for (const [m, [e, n]] of vortaro) {
    console.log(`${m}/${n} - ${e}`);
  }

  const kontrolilo = new Kontrolilo(vortaro);

  const eniri = () => {
    inquirer.prompt<Respondo>([{
      name: "eniro",
      message: ">"
    }]).then(({eniro}) => {
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
            } else {
              console.log(`${vorto} ne estas valida.`);
            }
          }
          break;
        case "eliri":
          konserviDosieron(vortaro);
          return;
        default:
          console.log("Nevalida eniro");
          break;
      }
      eniri();
    });
  };
  eniri();
});