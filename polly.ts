import * as fs from "fs";
import * as AWS from "aws-sdk";
import xmlbuilder from "xmlbuilder";

import { Kontrolilo } from "./kontrolilo";
import { SintaksoArbo, Legilo } from "./legilo";

const paŭzajVortoj = new Set(['brotas', 'premis']);

const polly = new AWS.Polly({
  region: "us-east-1"
});

const t1 = "sə'gi to bis lu'minə fitəm ponə trisə sə'leri";
const t2 = "sə'gi to bis ʃe'varə fitəm ponə nevum nori";
const t3 = "və'lono";

export function paroli(arbo: SintaksoArbo, dosiernomo: string) {
  const ssml = xmlbuilder
    .create("speak");
  const parolo = ssml.ele("prosody", { rate: "77%", pitch: "+7%", volume: "+6dB" });

  let vortoj: Array<string> = [];
  for (const vorto of Legilo.traversi(arbo)) {
    if (paŭzajVortoj.has(vorto)) {
      const IPA = igiIPA(vortoj);
      parolo.ele("phoneme", { alphabet: "ipa", ph: IPA.join(" ") });
      parolo.ele("break");
      vortoj = [vorto];
    } else {
      vortoj.push(vorto);
    }
  }

  if (vortoj.length > 0) {
    parolo.ele("phoneme", { alphabet: "ipa", ph: igiIPA(vortoj).join(" ") });
  }

  const teksto = ssml.end({ allowEmpty: false });
  console.log(teksto);

  polly.synthesizeSpeech(
    {
      OutputFormat: "ogg_vorbis",
      Text: teksto,
      VoiceId: "Ivy",
      TextType: "ssml"
    },
    (error, data) => {
      if (error) {
        throw error;
      } else {
        fs.writeFileSync("ekparolado/" + dosiernomo, data.AudioStream);
      }
    }
  );
}

export function igiIPA(vortoj: Array<string>): Array<string> {
  const IPA: Array<string> = [];
  for (const vorto of vortoj) {
    switch (vorto) {
      case "sagi":
        IPA.push("sə'gi");
        continue;
      default:
        break;
    }
    const silaboj = Array.from(Kontrolilo.silaboj(vorto));
    switch (silaboj.length) {
      case 1:
        IPA.push(silaboj[0]);
        break;
      case 2:
        IPA.push(`'${silaboj[0]}${silaboj[1].replace("a", "ə")}`);
        break;
      case 3:
        IPA.push(
          `${silaboj[0].replace(/a/g, "ə")}'${silaboj[1].replace('e', 'eɪ')}${silaboj[2].replace(
            "a",
            "ə"
          )}`
        );
        break;
      default:
        throw new Error(`Nevalida vorto: ${vorto}`);
    }
  }
  return IPA;
}
