import * as fs from "fs";
import * as readline from "readline";

const vortaroDosiero = "vortaro.txt";
let legitaVortaro: Map<string, [string, number]> | undefined;

export async function legiDosieron(): Promise<Map<string, [string, number]>> {
  if (legitaVortaro) return legitaVortaro;
  const rl = readline.createInterface(fs.createReadStream(vortaroDosiero));
  const vortaroPostaĵo = new Promise<Map<string, [string, number]>>(
    (resolve, reject) => {
      const vortaro = new Map<string, [string, number]>();
      rl.on("line", vico => {
        const [m, e, n] = vico.split("/");
        vortaro.set(m, [e, parseInt(n)]);
      });
      rl.on("close", () => {
        legitaVortaro = vortaro;
        resolve(legitaVortaro);
      });
    }
  );
  return vortaroPostaĵo;
}

export function konserviDosieron(vortaro: Map<string, [string, number]>) {
  const dosiero = fs.createWriteStream(vortaroDosiero);
  for (const [m, [e, n]] of vortaro) {
    dosiero.write(`${m}/${e}/${n}\n`);
  }
  dosiero.close();
}
