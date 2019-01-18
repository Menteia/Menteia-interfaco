import * as fs from 'fs';
import * as AWS from 'aws-sdk';
import xmlbuilder from 'xmlbuilder';

const polly = new AWS.Polly({
  region: 'us-east-1'
});

const t1 = "sə'gi to bis lu'minə fitəm ponə trisə sə'leri";
const t2 = "sə'gi to bis ʃe'varə fitəm ponə nevum nori";
const t3 = "və'lono";

export function testo() {
  const ssml = xmlbuilder
    .create('speak')
    .ele('prosody', {rate: 'slow', pitch: 'high'})
    .ele('phoneme', {alphabet: 'ipa', ph: t1})
    .end({allowEmpty: false});
  console.log(ssml);
  polly.synthesizeSpeech({
    OutputFormat: 'ogg_vorbis',
    Text: ssml,
    VoiceId: 'Ivy',
    TextType: 'ssml'
  }, (error, data) => {
    if (error) {
      console.error(error);
    } else {
      fs.writeFileSync('testo1-2.ogg', data.AudioStream);
      console.log('Dosieron konservita');
    }
  });
}