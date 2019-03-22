import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as readline from "readline";

const db = new AWS.DynamoDB({region: 'us-west-2'});
const lambda = new AWS.Lambda({region: 'us-east-1'});
const tabeloNomo = "Menteia-datumejo";

export async function aldoniVorton(vorto: string, tipo: string, aktantoj: Array<string>): Promise<AWS.DynamoDB.PutItemOutput> {
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
              vorto.split(" ").forEach((vorto) => {
                if (ekzistantaVorto != vorto &&
                    ekzistantaVorto != null &&
                    (vorto.startsWith(ekzistantaVorto) ||
                    ekzistantaVorto.startsWith(vorto) ||
                    vorto.endsWith(ekzistantaVorto) ||
                    ekzistantaVorto.endsWith(vorto))) {
                  malakcepti(new Error(`La vorto ${vorto} trafas kun ${ekzistantaVorto}`));
                  return;
                }
              });
            }
            db.putItem({
              TableName: tabeloNomo,
              Item: {
                vorto: {
                  S: vorto
                },
                valenco: {
                  N: aktantoj.length.toString()
                },
                tipo: {
                  S: tipo.replace("-", " ")
                },
                aktantoj: {
                  L: aktantoj.map((a) => ({S: a.replace("-", " ")}))
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

export async function agordiTipon(vortoj: Array<string>, tipo: string, aktantoj: Array<string>): Promise<void> {
  return new Promise((fini, fiaksi) => {
    vortoj.forEach((vorto) => {
      db.getItem({
        TableName: tabeloNomo,
        Key: {
          vorto: {
            S: vorto
          }
        }
      }, (err, data) => {
        if (err != null) {
          throw err;
        } else if (data.Item != null) {
          db.updateItem({
            TableName: tabeloNomo,
            Key: {
              vorto: {
                S: vorto
              }
            },
            UpdateExpression: "SET tipo = :t, aktantoj = :a, valenco = :v",
            ExpressionAttributeValues: {
              ":t": {
                S: tipo.replace("-", " ")
              },
              ":a": {
                L: aktantoj.map((a) => ({S: a.replace("-", " ")}))
              },
              ":v": {
                N: aktantoj.length.toString()
              }
            }
          }, (err, data) => {
            if (err) {
              fiaksi(err);
            } else {
              fini();
            }
          });
        }
      });
    });
  });
}