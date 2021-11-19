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
import faunadb from "faunadb"

const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

/**
 * Original Fauna DB example code: https://github.com/netlify/netlify-faunadb-example
 */

const q = faunadb.query
const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_KEY
})

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
            }, 200);
        });
    });
}

/**
 * Merge two lists of objects
 * 
 * Order of lists matters, index must correspond to correct track data
 * 
 * i.e.
 * 
 * foo = 
 * [
 *   {
 *     track_name: 'WAYIFEEL',
 *     track_artist: 'pax'
 *   },
 *   {
 *     track_name: 'houseplants',
 *     track_artist: 'rob smyles'
 *   }
 * ]
 * 
 * bar = 
  * [
 *   {
 *     track_url: 'https://soundcloud.com/pictochat/wayifeelwhenweetalked',
 *     track_img: 'https://i1.sndcdn.com/artworks-000408863781-7j5i38-t500x500.jpg'
 *   },
 *   {
 *     track_url: 'https://soundcloud.com/robbing-smiles/houseplants',
 *     track_img: 'https://i1.sndcdn.com/artworks-dyg1XflU5JrmY9ZY-DsOGPg-t500x500.jpg'
 *   }
 * ]
 * 
 * output = 
 * [
 *   {
 *     track_name: 'WAYIFEEL',
 *     track_artist: 'pax',
 *     track_url: 'https://soundcloud.com/pictochat/wayifeelwhenweetalked',
 *     track_img: 'https://i1.sndcdn.com/artworks-000408863781-7j5i38-t500x500.jpg'
 *   },
 *   {
 *     track_name: 'houseplants',
 *     track_artist: 'rob smyles'
 *     track_url: 'https://soundcloud.com/robbing-smiles/houseplants',
 *     track_img: 'https://i1.sndcdn.com/artworks-dyg1XflU5JrmY9ZY-DsOGPg-t500x500.jpg'
 *   }
 * ]
 * 
 * @param listOfObjects foo 
 * @param listOfObjects bar 
 */
function mergeResults(foo, bar) {
    foo.forEach((obj, i) => {
        obj['track_url'] = bar[i].track_url;
        obj['track_img'] = bar[i].track_img;
    })

    return foo;
}

export async function handler(event, context, callback) {

    const { SITE_URL } = process.env.SITE_URL
    const destination = `${
        SITE_URL || "http://localhost:9999"
    }/.netlify/functions/db-post-liked-tracks`

    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
        headless: true
    });

    const page = await browser.newPage();

    console.log("Opening browser...")

    await page.goto('https://soundcloud.com/shay-leon-2/likes', {waitUntil: 'domcontentloaded'});
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

    // const results = await page.$$eval('div.sound__body', (items) => {
    //     return items.map(item => {
    //         return {
    //             track_name: item.children[1].children[0].children[0].children[0].children[1].children[1].innerText,
    //             track_artist: item.children[1].children[0].children[0].children[0].children[1].children[0].children[0].innerText,
    //             track_url: item.children[0].children[0].href,
    //             track_img: item.children[0].children[0].children[0].children[0].attributes.style.value.slice(62,-3)
    //         }
    //     })
    // });


    // const scrapedData = await page.evaluate(() =>
    //     Array.from(document.querySelectorAll('div.sound__body'))
    //       .map(item => ({
    //             track_url: item.children[0].children[0].href,
    //             track_img: item.children[0].children[0].children[0].children[0].attributes.style.value.slice(62,-3)
    //         })))

    // console.log(scrapedData);

    const urlImgResults = await page.$$eval('div.sound__body', (items) => {
        return items.map(item => {
            return {
                track_url: item.children[0].children[0].href,
                track_img: item.children[0].children[0].children[0].children[0].attributes.style.value.slice(62,-3)
            }
        })
    });

    const results = await page.$$eval('div.soundTitle__usernameTitleContainer', (items) => {
        return items.map(item => {
            return {
                track_name: item.children[1].children[0].innerText,
                track_artist: item.children[0].children[0].children[0].innerText
            }
        })
    });

    let mergedResults = mergeResults(results, urlImgResults);

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
            body: JSON.stringify({ data: { tracks: mergedResults } })
        })
        .then(response => response.json())
        .then(data => console.log(data))
    } catch (err) {
        console.log(`Fetch failed 😒 ${err}`)
    }
}