import * as AWS from "aws-sdk";

const db = new AWS.DynamoDB({region: 'us-west-2'});
const tabeloNomo = "Menteia-datumejo";

db.scan({
  TableName: tabeloNomo,
  FilterExpression: "attribute_exists(genera) and attribute_exists(tipaktantoj)"
}, (err, data) => {
  if (err) {
    throw err;
  } else {
    const vortoj = data.Items;
    if (vortoj != null) {
      for (const vorto of vortoj) {
        db.updateItem({
          TableName: tabeloNomo,
          Key: {
            vorto: {
              S: vorto.vorto.S
            }
          },
          UpdateExpression: "REMOVE genera, tipaktantoj",
        }, (err, data) => {
          if (err) throw err;
        });
      }
    }
  }
});