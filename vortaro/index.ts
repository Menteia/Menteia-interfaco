import * as fs from "fs";
import * as readline from "readline";

const vortaroDosiero = "vortaro.txt";

export function legiDosieron(): Promise<Map<string, string>> {
  const rl = readline.createInterface(fs.createReadStream(vortaroDosiero));
  const vortaroPostaĵo = new Promise<Map<string, string>>((resolve, reject) => {
    const vortaro = new Map<string, string>();
    rl.on('line', (vico) => {
      const [m, e] = vico.split("/");
      vortaro.set(m, e);
    });
    rl.on('close', () => {
      resolve(vortaro);
    });
  });
  return vortaroPostaĵo;
}