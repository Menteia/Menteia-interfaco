import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as readline from "readline";

const db = new AWS.DynamoDB({region: 'us-west-2'});
const lambda = new AWS.Lambda({region: 'us-east-1'});
const tabeloNomo = "Menteia-vortaro";

export async function aldoniVorton(vorto: string, valenco: string): Promise<AWS.DynamoDB.PutItemOutput> {
  return new Promise((akcepti, malakcepti) => {
    lambda.invoke({
      FunctionName: 'Menteia-Kontrolilo',
      Payload: JSON.stringify({
        Vorto: vorto
      })
    }, (err, data) => {
      if (err) {
        malakcepti(err);
      } else if (typeof data.Payload === "string") {
        const respondo: {ĈuValida: boolean, Kialo: string} = JSON.parse(data.Payload);
          db.scan({
          TableName: tabeloNomo
        }, (err, data) => {
          if (err) {
            malakcepti(err);
          } else if (data.Items == null) {
            malakcepti(new Error(`Ne eblas legi la vortaron`));
          } else {
            for (const v of data.Items) {
              const ekzistantaVorto = v.vorto.S;
              if (ekzistantaVorto != null &&
                  (vorto.startsWith(ekzistantaVorto) ||
                  ekzistantaVorto.startsWith(vorto) ||
                  vorto.endsWith(ekzistantaVorto) ||
                  ekzistantaVorto.endsWith(vorto))) {
                malakcepti(new Error(`La vorto ${vorto} trafas kun ${ekzistantaVorto}`));
                return;
              }
            }
            db.putItem({
              TableName: tabeloNomo,
              Item: {
                vorto: {
                  S: vorto
                },
                valenco: {
                  N: valenco
                },
              },
              ConditionExpression: "attribute_not_exists(Vorto)"
            }, (err, data) => {
              if (err) {
                malakcepti(err);
              } else {
                akcepti(data);
              }
            });
          }
        });
      } else {
        malakcepti(new Error("Ne eblas kontroli la vorton"));
      }
    })
  });
}