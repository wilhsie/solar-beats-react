/*
 *  Goal here is to write a function that does the following:
 *   - When given a soundcloud username,
 *     returns all the songs the user has liked on soundcloud
 * 
 *   Use Cheerio library to scrape data from soundcloud
**/


// import cheerio from "cheerio"

export function handler(event, context, callback) {
    console.log('queryStringParameters', event.queryStringParameters)
    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ msg: 'web scraper goes here ^ - ^' }),
    })
  }