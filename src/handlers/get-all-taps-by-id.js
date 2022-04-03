const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();
const parse = AWS.DynamoDB.Converter.unmarshall;
AWS.config.update({
  region: "us-east-2",
});

exports.handler = async (events) => {
  const { id: boardId } = events.pathParameters;
  const { BOARDS_TABLE } = process.env;
  const params = {
    TableName: BOARDS_TABLE,
    KeyConditionExpression: "#device_id = :device",
    ExpressionAttributeNames: {
      "#device_id": "device_id",
    },
    ExpressionAttributeValues: {
      ":device": boardId,
    },
    ScanIndexForward: false,
    Limit: 1,
  };
  const headers = {
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,GET",
  };

  try {
    const data = await ddb
      .query(params)
      .promise()
      .then((data) => {
        if (data.Items.length > 0) {
          const item = data.Items[0];
          const device_data = parse(item.device_data);
          return { ...item, device_data };
        }
        return null;
      });

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
      headers,
    };
  }
};
