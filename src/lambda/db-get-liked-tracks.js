/**
 * Return liked tracks data
 * 
 * reaaaalllly hoping this article will be promising: https://nordschool.com/build-a-serverless-database-using-faunadb-and-netlify-functions/
 * 
 * CRUD faunadb x netlify example code: https://github.com/netlify/netlify-faunadb-example/blob/master/functions/todos-read-all.js
 */

require('dotenv').config();

import faunadb from "faunadb";

const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.SOLARBEATS_SERVER_KEY })

exports.handler = async (event, context) => {
    console.log('Function `db-get-liked-tracks` invoked...');
    return client.query(q.Get(q.Ref(q.Collection('liked-tracks'), process.env.TEST_DOCUMENT)))
    .then((response) => {
        const data = response.data;
        console.log(`liked-tracks: ${JSON.stringify(data)}`);
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        }
    }).catch((err) => {
        console.log(`db-get-liked-tracks error: ${err}`)
        return {
            statusCode: 400,
            body: JSON.stringify(err)
        }
    });
}


