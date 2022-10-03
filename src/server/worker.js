const fs = require('fs');
const { parse } = require('csv-parse');

// Helper function to check a CSV file for records containing provided id
const checkCSV = ({ id, filePath }) => {
  return new Promise(function (resolve, reject) {
    const dataObj = [];

    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: ',', from_line: 1 }))
      .on('data', function (row) {
        const [station] = row;
        if (id === station) {
          dataObj.push(row);
        }
      })
      .on('error', function (error) {
        console.log(error.message);
        return reject(error);
      })
      .on('end', function () {
        resolve(dataObj);
        console.log('finished');
      });
  });
};

module.exports = checkCSV;
