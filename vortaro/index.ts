import * as AWS from "aws-sdk";
import * as fs from "fs";
import * as readline from "readline";

const db = new AWS.DynamoDB({region: 'us-west-2'});
const lambda = new AWS.Lambda({region: 'us-east-1'});
const tabeloNomo = "Menteia-datumejo";

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

export async function agordiTipon(vortoj: Array<string>, tipo: string, aktantoj: Array<string>, genera: boolean, tipaktantoj: Array<string>): Promise<void> {
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
          const v = data.Item.valenco.N;
          if (v == null) {
            fiaksi(`Ne eblas trovi la valencon de ${vorto}`);
          } else {
            const valenco = parseInt(v);
            if (aktantoj.length !== valenco) {
              fiaksi(`La valenco de ${vorto} kaj la longeco de la aktantoj ne estas la sama`);
            } else {
              db.updateItem({
                TableName: tabeloNomo,
                Key: {
                  vorto: {
                    S: vorto
                  }
                },
                UpdateExpression: "SET tipo = :t, aktantoj = :a, genera = :g, tipaktantoj = :ta",
                ExpressionAttributeValues: {
                  ":t": {
                    S: tipo
                  },
                  ":a": {
                    L: aktantoj.map((a) => ({S: a}))
                  },
                  ":g": {
                    BOOL: genera
                  },
                  ":ta": {
                    L: tipaktantoj.map((a) => ({S: a})),
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
          }
        }
      });
    });
  });
}