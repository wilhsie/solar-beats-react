/**
 * idk wtf i'm doing lmao
 * api endpoint that creates new users in our database
 * 
 */
require('dotenv').config();
import faunadb from "faunadb";

const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.SOLARBEATS_SERVER_KEY })

exports.handler = async (event, context) => {
    console.log('Function `db-sign-up` invoked...');
    let payload = JSON.parse(event.body);
    let userData = payload.user_data;
    let password = payload.password;

    return client.query(
        q.Create(
            q.Collection('users'), {
                credentials: {
                    password: password
                },
                data: userData
            }
        )
    ).then((response) => {
        const data = response.data;
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        }
    }).catch((err) => {
        return {
            statusCode: 400,
            body: JSON.stringify(err)
        }
    })
}