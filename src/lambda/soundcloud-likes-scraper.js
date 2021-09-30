/*
 *  Goal here is to write a function that does the following:
 *   - When given a soundcloud username,
 *     returns all the songs the user has liked on soundcloud
 * 
 *   Use Cheerio library to scrape data from soundcloud
 * 
 * 
 * ... soooo cheerio wasn't working cuz soundcloud requires javascript to run on the website or someth...
 *   gonna try to use puppeteer instead caus its automation tool will open up a browser that will run stuff
 *   like js, but also we cn trigger the scroll to the bottom of user likes **hopefully**
 *   ouuuuu kehhh lezzz goooo
 *   coding to Ross from Friends lol - The OUtsiders album
 * 
 * 
 *   Okay UPDATE: basically puppeteer isn't working for som reason idk
 *   running into this: TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received undefined
 *   wat da hek, gonn do mor research
**/


import cheerio from "cheerio"
import axios from "axios"
import puppeteer from "puppeteer"

/*
async function fetchHTML(url) {
    const data = await axios.get(url)
    return cheerio.load(data)
}
*/

export async function handler(event, context, callback) {

    // soooo what parts can we salvage????

    try {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://example.com');
        await page.screenshot({ path: 'example.png' });
      
        await browser.close();

        /*
        const { data } = await axios.get("https://soundcloud.com/shay-leon-2/likes")
        const $ = cheerio.load(data)
        let likesHTML = $('body > div > noscript').html()
        console.log(likesHTML)
        */


        return {
          statusCode: 200,
          body: JSON.stringify({ msg: likesHTML })
        }
      } catch (err) {
        console.log(err) // output to netlify function log
        return {
          statusCode: 500,
          body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
        }
    }
}