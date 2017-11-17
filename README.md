# node-mongo-csv-demo-2017

Import CSV files as downloaded from the police crimes database.

Display these in a grid of sectors, each one tenth of a degree. 

Heatmap by number of crimes.


## Setup

- install MongoDb from http://docs.mongodb.org/manual/installation/
- download the crimes files you want and place them in assets/crimes-data-import -- folder structure does not matter. Use the download page linked to from here: https://data.police.uk/
- (in terminal)
$ npm install
- (new terminal, same dir) 
$ mongod
- (new terminal, same dir) 
$ node app
- (in terminal)
$ ./node_modules/mocha/bin/mocha
- (in terminal)
$ node scripts/import.js
- (in your browser)
localhost:3000

## Objectives

- Node express REST API
- Mongo database
- CSV import

## TODO list

- Expand unit tests using boilerplate
- Use handlebars for html rendering
- Display per-sector crimes in a sortable grid with detail view
