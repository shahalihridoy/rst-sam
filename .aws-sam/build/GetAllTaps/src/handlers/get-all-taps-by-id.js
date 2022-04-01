const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB.DocumentClient()

exports.handler = async () => {
  const { BOARDS_TABLE } = process.env
  AWS.config.update({
    region: 'us-east-2'
  })
  const params = {
    TableName: BOARDS_TABLE,
    FilterExpression: '#x = :device and attribute_not_exists(#y)',
    ExpressionAttributeNames: {
      '#x': 'device_id',
      '#y': 'device_data_raw'
    },
    ExpressionAttributeValues: {
      ':device': 'test_modem2'
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
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    }
  }
}
