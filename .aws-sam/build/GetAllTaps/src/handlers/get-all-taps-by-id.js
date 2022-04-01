const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = async () => {
  const { BOARDS_TABLE } = process.env
  AWS.config.update({
    region: 'us-east-2'
  })

  const params = {
    TableName: BOARDS_TABLE,
    FilterExpression: '#x = :device',
    ExpressionAttributeNames: {
      '#x': 'device_id'
    },
    ExpressionAttributeValues: {
      ':device': 'test_modem2'
    }
  }

  if (!BOARDS_TABLE) {
    return {
      statusCode: 200,
      body: 'boards table not found'
    }
  }

  try {
    const data = await ddb
      .scan(params)
      .promise()
      .then((data) => data.Items)
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}
