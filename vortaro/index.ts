import * as fs from "fs";
import * as readline from "readline";

const vortaroDosiero = "vortaro.txt";

export function legiDosieron(): Promise<Map<string, [string, number]>> {
  const rl = readline.createInterface(fs.createReadStream(vortaroDosiero));
  const vortaroPostaĵo = new Promise<Map<string, [string, number]>>(
    (resolve, reject) => {
      const vortaro = new Map<string, [string, number]>();
      rl.on("line", vico => {
        const [m, e, n] = vico.split("/");
        vortaro.set(m, [e, parseInt(n)]);
      });
      rl.on("close", () => {
        resolve(vortaro);
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
