import { config } from "dotenv";
config();

import * as readline from "readline";
import * as inquirer from "inquirer";
import moment from "moment";

import { aldoniVorton, transferi } from "./vortaro";

interface Respondo {
  eniro: string;
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
          const vorto = partoj[1];
          aldoniVorton(vorto, partoj[2]).catch((e) => {
            console.error(e);
          }).then((data) => {
            console.log(data);
          }).finally(() => {
            eniri();
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