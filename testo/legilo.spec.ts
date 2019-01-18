import { expect } from "chai";
import "mocha";

import { Legilo } from "../legilo";
import { legiDosieron } from "../vortaro";

legiDosieron().then((vortaro) => {
  const legilo = new Legilo(vortaro);

  describe("La legilo povas legi silabojn", () => {
    it("povas legi bazan frazon", () => {
      const frazo = "sagitobisʃevarafitamponanevumnori";
      expect(Array.from(legilo.vortigi(frazo))).to.eql(
        ["sagi", "to", "bis", "ʃevara", "fitam", "pona", "nevum", "nori"]
      );
    });
  });
});