require('dotenv').config()

// this uses the callback syntax, however, we encourage you to try the async/await syntax shown in async-dadjoke.js
export function handler(event, context, callback) {

  let data = {}

  if (event.httpMethod === "POST") {
    try {
      data = JSON.parse(event.body)
    } catch (err) {
      console.log("Unable to parse event body!  Are you passing it correctly?", err)
    }
  }

  console.log("data: ", data)

  console.log('queryStringParameters', event.queryStringParameters)
  
  // callback(null, {
  //   statusCode: 200,
  //   body: JSON.stringify({ msg: 'Hello, World!' + process.env.CHROME_EXECUTABLE_PATH }),
  // })

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Serverless functions are functionally convenient lmao, it fuckkkin worked?",
      data,
    })
  }
}
