require('dotenv').config();
const faunadb = require('faunadb');

const q = faunadb.query
const client = new faunadb.Client({
    secret: process.env.SOLARBEATS_SERVER_KEY
})

exports.handler = async (event, context) => {
    console.log('Function `db-sign-in` invoked... ');
    let payload = JSON.parse(event.body);
    
    const email = payload.email
    const password = payload.password

    return client.query(
        q.Login(
            q.Match(q.Index('users_by_email'), email), 
            { password: password }
        )
    ).then((response) => {
        /**
         * if user has been authorized:
         * store auth token aka secret
         * route user to home page
         */

        const data = response.secret;
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