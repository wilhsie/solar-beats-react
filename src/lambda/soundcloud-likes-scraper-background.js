/*
 *  Goal here is to write a function that does the following:
 *   - When given a soundcloud username,
 *     returns all the songs the user has liked on soundcloud
 * 
 *  UPDATE: Okay, following this video / website:
 *   - https://spacejelly.dev/posts/how-to-use-puppeteer-to-automate-chrome-in-an-api-with-netlify-serverless-functions/
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
     * Scroll to bottom, grab track information (artist, track title, track url, cover art)
     */

    /**
     * Run background functions locally using:
     * `netlify functions:serve`
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

    // we're now able to get data back from our background functions by doing a fetch after the scrape
    // as described in this video (at about 17ish minutes in):
    // https://www.youtube.com/watch?v=HYA-SYZWYWU&ab_channel=UncaughtException

    // okay .. so .. i'm not sure why I can't pass the data we scraped to the front end .. 
    // trying to resolve any potential CORS issues by using setupProxy.js as explained in this video:
    // https://www.youtube.com/watch?v=3ldSM98nCHI&ab_channel=swyx

    // UPDATE: don't use npm run start, use `netlify dev` it fixes react POST to serverless function issue

    // TODO: allow react to consume data scraped by soundcloud-likes-scraper-background
    // TODO: wrangle proper data from given user's soundcloud likes, i.e. scroll-to-bottom is not working properly

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
}