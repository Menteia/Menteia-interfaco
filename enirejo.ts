import {legiDosieron} from "vortaro";

legiDosieron().then((vortaro) => {
  for (const [m, e] of vortaro) {
    console.log(`${m} - ${e}`);
  }
});