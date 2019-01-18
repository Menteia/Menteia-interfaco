import { expect } from "chai";
import "mocha";

import { igiIPA } from "../polly";

describe("Ekparolo per Polly", () => {
  it("povas igi vortojn en IPA-silaboj", () => {
    const vortoj = [
      "sagi",
      "to",
      "bis",
      "ʃevara",
      "fitam",
      "pona",
      "nevum",
      "nora"
    ];
    expect(igiIPA(vortoj)).to.eql(
      "sə'gi to bis ʃe'varə 'fitəm 'ponə 'nevum 'norə"
    );
  });
});
