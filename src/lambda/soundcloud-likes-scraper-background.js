/*
 *  Goal here is to write a function that does the following:
 *   - When given a soundcloud username,
 *     returns all the songs the user has liked on soundcloud
 * 
 *   Okay UPDATE: basically puppeteer isn't working for som reason idk
 *   running into this: 
 *  
 *   TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received undefined
 * 
 *   wat da hek, gonn do mor research
 * 
 *  UPDATE: Okay, following this video / website:
 *   - https://spacejelly.dev/posts/how-to-use-puppeteer-to-automate-chrome-in-an-api-with-netlify-serverless-functions/
 * 
 *   TODO: dotenv package doesn't seem to be working / process.env.CHROME_EXECUTABLE_PATH returns undefined
 *   even though we've defined it in our .env file??? hm
 * 
 *   TODO: Okay we got dotenv working with the require('dotenv').config(), now all we need to do is figure out how to select
 *   things using puppeteer and we GOLDEN lol
 * 
**/

require('dotenv').config()

import fetch from "node-fetch"

const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

/**
 * Got this function from here:
 * https://stackoverflow.com/questions/51529332/puppeteer-scroll-down-until-you-cant-anymore
 * 
 * @param {*} page 
 */
async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

export async function handler(event, context, callback) {

    const { SITE_URL } = process.env.SITE_URL
    const destination = `${
        SITE_URL || "http://localhost:9999"
    }/.netlify/functions/hello`

    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
        headless: true
    });

    const page = await browser.newPage();

    console.log("Opening browser...")

    await page.goto('https://soundcloud.com/shay-leon-2/likes');
    await page.setViewport({
        width: 1200,
        height: 800
    });

    /**
     * Okay so we're able to grab all the artist names and track names from the DOM
     * but first we want to scroll alll the way to the bottom before running our $$eval
     * okeh how we do dat ...
     */

    /**
     * 
     * okay so .. we're not sure if autoScrolling works or not cause ... we get a 10 second time out before
     * we can see any results .. sooooo
     * one option is to create this thing called a "background" function
     * which is a feature of netlify .. and background functions will allow me to increase the timeout
     * to 15 minutes ...
     * 
     * so .. before considering upgrading to the 19/month netlify tier .. can we increase the timeout limit
     * without doing so?
     * 
     * going to look into this error msg:
     * Your lambda function took longer than 10 seconds to finish.
     * If you need a longer execution time, you can increase the timeout using the -t or --timeout flag.
     * Please note that default function invocation is 10 seconds, 
     * check our documentation for more information (https://www.netlify.com/docs/functions/#custom-deployment-options)
     * 
     * okay couple options:
     *  - parallelize scraping calls better ... (not guaranteed to work .. )
     *  - experiment with background functions (not sure how we will return the scraped data, apparently you need "outside sources" to monitor bg function responses)
     * 
     */

    console.log("Scrolling to bottom of likes page...")

    await autoScroll(page);

    const title = await page.title();
    const results = await page.$$eval('div.soundTitle__usernameTitleContainer', (items) => {
        return items.map(item => {
            return {
                artist: item.children[0].children[0].children[0].innerHTML,
                track: item.children[1].children[0].innerHTML
            }
        })
    });

    await browser.close();

    console.log(`Sending data to destination: ${destination}...`)

    // so background functions now work, we need to pass the scraped data after the web scrape is completed

    try {
        fetch(destination, {
            method: "POST",
            body: JSON.stringify({
                page: {
                    results
                }
            })
        })
    } catch (err) {
        console.log(`Fetch failed 😒 ${err}`)
    }

    // return {
    //     statusCode: 200,
    //     body: JSON.stringify({
    //         status: 'Ok',
    //         page: {
    //             title,
    //             results
    //         }
    //     })
    // };
}