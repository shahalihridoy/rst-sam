const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();
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

  try {
    const data = await ddb
      .query(params)
      .promise()
      .then((data) => data.Items);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
