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
    FilterExpression: "#x = :device and attribute_not_exists(#y)",
    ExpressionAttributeNames: {
      "#x": "device_id",
      "#y": "device_data_raw",
    },
    ExpressionAttributeValues: {
      ":device": boardId,
    },
    Limit: 1,
  };

  try {
    const data = await ddb
      .scan(params)
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
