import { expect } from 'chai';
import 'mocha';

import { Kontrolilo } from '../kontrolilo';

const ĝi = it;

describe('la kontrolilo funkcias per vortaro', () => {
  const vortoj = {
    saleri: 'pluvo',
    lumina: 'vetero',
  };
  const kontrolilo = new Kontrolilo(new Map(Object.entries(vortoj)));
  ĝi('malakceptas la vortojn, kiuj estas prefiksoj de alia vorto', () => {
    expect(kontrolilo.validas('salerina')).to.be.false;
  });
});