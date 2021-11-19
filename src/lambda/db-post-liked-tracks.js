/**
 * Delete current liked track data and post new liked tracks data
 * 
 * original code copied from ./db-get-liked-tracks.js
 * 
 * CRUD faunadb x netlify example code: https://github.com/netlify/netlify-faunadb-example/blob/master/functions/todos-read-all.js
 */

 require('dotenv').config();

 import faunadb from "faunadb";
 
 const q = faunadb.query;
 const client = new faunadb.Client({ secret: process.env.SOLARBEATS_SERVER_KEY })
 const testTracks = [
    {
        "track_name": "WAYIFEEL",
        "track_artist": "pax",
        "track_url": "https://soundcloud.com/pictochat/wayifeelwhenweetalked",
        "track_img": "https://i1.sndcdn.com/artworks-000408863781-7j5i38-t500x500.jpg"
      },
      {
        "track_name": "TheThingsYouDo",
        "track_artist": "slom",
        "track_url": "https://soundcloud.com/slominu/thethingsudo",
        "track_img": "https://i1.sndcdn.com/artworks-000341816973-kiw3fl-t500x500.jpg"
      },
      {
        "track_name": "houseplants",
        "track_artist": "rob smyles",
        "track_url": "https://soundcloud.com/robbing-smiles/houseplants",
        "track_img": "https://i1.sndcdn.com/artworks-dyg1XflU5JrmY9ZY-DsOGPg-t500x500.jpg"
      },
      {
          "track_name": "WANTUTOGETUP",
          "track_artist": "SHAY LEON",
          "track_url": "https://soundcloud.com/shay-leon-2/wantutogetup",
          "track_img": "https://i1.sndcdn.com/artworks-4vwksf1iGkyiM6Ch-C0oWHw-t500x500.jpg"
      }
 ]
 
 exports.handler = async (event, context) => {
     // console.log(JSON.parse(event.body))
     console.log('Function `db-post-liked-tracks` invoked...');
     return client.query(
         q.Update(
             q.Ref(q.Collection('liked-tracks'), process.env.TEST_DOCUMENT),
             JSON.parse(event.body)
             // { data: { tracks: testTracks } }
             ))
     .then((response) => {
         console.log(`successfully updated tracks db: ${response}`);
         return {
             statusCode: 200,
             body: JSON.stringify(response)
         }
     }).catch((err) => {
         console.log(`db-post-liked-tracks error: ${err}`)
         return {
             statusCode: 400,
             body: JSON.stringify(err)
         }
     });
 }
 
 
 