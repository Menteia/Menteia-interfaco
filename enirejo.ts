import { config } from "dotenv";
config();

import * as readline from "readline";
import * as inquirer from "inquirer";
import moment from "moment";

import { aldoniVorton, agordiTipon } from "./vortaro";

interface Respondo {
  eniro: string;
}

interface Tipagordo {
  tipo: string,
  aktantoj: string
}

interface Novavorto {
  vorto: string,
  tipo: string,
  aktantoj: string
}

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
          inquirer.prompt<Novavorto>([
            {
              name: "vorto",
              message: "Vorto"
            },
            {
              name: "tipo",
              message: "Tipo",
            },
            {
              name: "aktantoj",
              message: "Aktantoj"
            }
          ]).then(({vorto, tipo, aktantoj}) => {
            if (tipo.length === 0) {
              throw "Necesas tipon";
            }
            aldoniVorton(vorto, tipo, aktantoj.length === 0 ? [] : aktantoj.split(" ")).catch((e) => {
              console.error(e);
            }).then((data) => {
              console.log(data);
            }).finally(() => {
              eniri();
            });
          });
          break;
        case "agordi":
          const vortoj = partoj[1].split(",");
          inquirer.prompt<Tipagordo>([
            {
              name: "tipo",
              message: "Tipo"
            },
            {
              name: "aktantoj",
              message: "aktantoj"
            }
          ]).then((agordo) => {
            const tipo = agordo.tipo;
            const aktantoj = agordo.aktantoj.length === 0 ? [] : agordo.aktantoj.split(" ");
            agordiTipon(vortoj, tipo, aktantoj).catch((e) => {
              console.error(e);
            }).finally(() => {
              eniri();
            });
          });
          break;
        case "eliri":
          return;
        default:
          eniri();
          break;
      }
    });
};
eniri();