import { Respondilo } from ".";

export const respondiloj = new Map<string, Respondilo>();
respondiloj.set("ko", ([opcio]) => {
  switch (opcio.radiko) {
    case "lurina":
      const { lurina } = require('./vetero');
      return lurina(opcio.opcioj);
      break;
    default:
      throw new Error(opcio.radiko);
  }
});