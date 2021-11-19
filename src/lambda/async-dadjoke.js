// example of async handler using async-await
// https://github.com/netlify/netlify-lambda/issues/43#issuecomment-444618311

// import axios from "axios"
// export async function handler(event, context) {
//   try {
//     const response = await axios.get("https://icanhazdadjoke.com", { headers: { Accept: "application/json" } })
//     const data = response.data
//     return {
//       statusCode: 200,
//       body: JSON.stringify({ msg: data.joke })
//     }
//   } catch (err) {
//     console.log(err) // output to netlify function log
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
//     }
//   }
// }

import fetch from "node-fetch";

exports.handler = (event, context) => {
  return new Promise((resolve, reject) => {
    fetch('https://api.chucknorris.io/jokes/random')
    .then(res => {
      if (res.ok) { // res.status >= 200 && res.status < 300
        return res.json();
      } else {
        resolve({ statusCode: res.status, body: res.statusText })
      };
    })
    .then(data =>{
      const response = {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data)
      }
      resolve(response);
    })
    .catch(err => {
      console.log(err)
      resolve({ statusCode: 500, body: err.message });
    })
  });
};