import { expect } from "chai";
import "mocha";

import { Legilo, SintaksoArbo } from "../legilo";
import { legiDosieron } from "../vortaro";

legiDosieron().then(vortaro => {
  const legilo = new Legilo(vortaro);

  describe("La legilo povas legi silabojn", () => {
    it("povas legi bazan frazon", () => {
      const frazo = "sagitobisʃevarafitamponanevumnora";
      expect(Array.from(legilo.vortigi(frazo))).to.eql([
        "sagi",
        "to",
        "bis",
        "ʃevara",
        "fitam",
        "pona",
        "nevum",
        "nora"
      ]);
    });
  });

  describe("La legilo povas konstrui sintaksarbojn", () => {
    it("povas legi frazon", () => {
      const frazo = "sagitobisʃevarafitamponanevumnora";
      const arbo: SintaksoArbo = {
        radiko: "sagi",
        opcioj: [{
          radiko: "to",
          opcioj: [{
            radiko: "bis",
            opcioj: [{
              radiko: "ʃevara",
              opcioj: []
            }, {
              radiko: "fitam",
              opcioj: [{
                radiko: "pona",
                opcioj: []
              }]
            }]
          }, {
            radiko: "nevum",
            opcioj: [{
              radiko: "nora",
              opcioj: []
            }]
          }],
        }],
      };
      expect(legilo.kompreni(frazo)).to.eql(arbo);
    });
  });
});
