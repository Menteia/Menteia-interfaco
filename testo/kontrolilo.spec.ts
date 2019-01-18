import { expect } from "chai";
import "mocha";

import { Kontrolilo } from "../kontrolilo";

const ĝi = it;

describe("la kontrolilo funkcias per vortaro", () => {
  const vortoj: { [K: string]: [string, number] } = {
    saleri: ["pluvo", 0],
    lumina: ["vetero", 0],
  };
  const kontrolilo = new Kontrolilo(new Map(Object.entries(vortoj)));

  ĝi("malakceptas la vortojn, kiuj estas prefiksoj de alia vorto", () => {
    expect(kontrolilo.validas("salerina")).to.be.false;
    expect(kontrolilo.validas("sale")).to.be.false;
  });

  ĝi("malakceptas la vortojn, kiuj estas postfiksoj de alia vorto", () => {
    expect(kontrolilo.validas("leri")).to.be.false;
    expect(kontrolilo.validas("vilumina")).to.be.false;
  });

  ĝi("akceptas la validajn vortojn", () => {
    expect(kontrolilo.validas("sakini")).to.be.true;
  });

  ĝi("montras la pravajn silaboj", () => {
    expect(Array.from(kontrolilo.silaboj("marika"))).to.eql(["ma", "ri", "ka"]);
    expect(Array.from(kontrolilo.silaboj("bis"))).to.eql(["bis"]);
    expect(Array.from(kontrolilo.silaboj("salekres"))).to.eql(["sa", "le", "kres"]);
  });

  ĝi("malakceptas la invalidajn vortojn", () => {
    expect(() => { Array.from(kontrolilo.silaboj("mar")); }).to.throw();
    expect(() => { Array.from(kontrolilo.silaboj("sra")); }).to.throw();
  });
});
