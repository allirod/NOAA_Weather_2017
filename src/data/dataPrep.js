// Does not run with application, left to show how data was prepped and transformed
// An unzipped version of the provided file was initially within the ./src/data folder named 2017.csv
// but has been removed due to size
const fs = require('fs');
const { parse } = require('csv-parse');
const csvArray = require('./csvNames');
const path = require('path');

// Create an object (wSO) which will hold the write streams to chunk the 2017.csv file into
// manageable/searchable pieces
const wSO = {};

// Iterate over the csvArray which holds letters to differentiate the csv files from eachother
csvArray.forEach((el) => {
  wSO[el] = fs.createWriteStream(path.join(__dirname, '/2017' + el + '.csv'));
});

let counter = 1; // to track which row of data is processing

// create write stream for a file to hold all station id's as a dropdown for UI
const stationFile = fs.WriteStream(path.join(__dirname, '/stationIds.js'));
stationFile.write('module.exports = \n');
const stationSet = new Set();

// read and parse each row of CSV as a stream, adding it to appropriate chunk file
fs.createReadStream(path.join(__dirname, '/2017.csv'))
  .pipe(parse({ delimiter: ',', from_line: 1 }))
  .on('data', function (row) {
    let letter =
      counter < 9 * 10 ** 6
        ? 'a'
        : counter < 18 * 10 ** 6
        ? 'b'
        : counter < 27 * 10 ** 6
        ? 'c'
        : 'd';

    wSO[letter].write(row.join() + '\n');
    counter++;

    // id list for UI dropdown
    const [id] = row;
    if (!stationSet.has(id)) stationSet.add(id);
  })
  .on('error', function (error) {
    console.log(error.message);
  })
  .on('end', function () {
    stationFile.write(JSON.stringify([...stationSet]) + ';');
    console.log('finished');
  });
