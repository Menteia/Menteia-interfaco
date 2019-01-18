import * as fs from "fs";
import * as AWS from "aws-sdk";
import xmlbuilder from "xmlbuilder";

import { Kontrolilo } from "./kontrolilo";

const polly = new AWS.Polly({
  region: "us-east-1"
});

const t1 = "sə'gi to bis lu'minə fitəm ponə trisə sə'leri";
const t2 = "sə'gi to bis ʃe'varə fitəm ponə nevum nori";
const t3 = "və'lono";

export function paroli(vortoj: Array<string>, dosiernomo: string) {
  const IPA = igiIPA(vortoj);
  const ssml = xmlbuilder
    .create("speak")
    .ele("prosody", { rate: "77%", pitch: "+13%" })
    .ele("phoneme", { alphabet: "ipa", ph: IPA })
    .end({ allowEmpty: false });
  polly.synthesizeSpeech(
    {
      OutputFormat: "ogg_vorbis",
      Text: ssml,
      VoiceId: "Ivy",
      TextType: "ssml"
    },
    (error, data) => {
      if (error) {
        throw error;
      } else {
        fs.writeFileSync(dosiernomo, data.AudioStream);
      }
    }
  );
}

export function igiIPA(vortoj: Array<string>): string {
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
          `${silaboj[0].replace("a", "ə")}'${silaboj[1]}${silaboj[2].replace(
            "a",
            "ə"
          )}`
        );
        break;
      default:
        throw new Error(`Nevalida vorto: ${vorto}`);
    }
  }
  return IPA.join(" ");
}
