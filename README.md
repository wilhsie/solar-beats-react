## SOLAR BEATS

`netlify functions:serve` will launch serverless function dev server

 use `netlify dev` to launch netlify dev server a.k.a. don't use `npm run start`
 
 TODO: allow react to consume data scraped by soundcloud-likes-scraper-background

  - background functions do not return a response body
  - data scraped by a background function can be POST'd to and handled by a separate serverless function
  - can we, and if so, how do we return this data 
  - it seems like background functions are incapable of sending data back to the browser regardless of serverless helper functions
  - so gonna experiment with faunaDB:
  - use background function to scrape, then POST data to faunaDB
  - fetch data from faunaDB when it's populated
  - faunaDB is working, created test data
  - able to get data to browser
  - having issue where React .. doesn't like JSON .. ?  idk I'll figure this out in a few

 TODO: wrangle proper data from given user's soundcloud likes, i.e. scroll-to-bottom is not working properly

## Create-React-App-Lambda

Original project at https://github.com/netlify/create-react-app-lambda