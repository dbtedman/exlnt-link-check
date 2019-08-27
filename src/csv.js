const fs = require("fs");
const csv = require("csv-parser");

/**
 * @param {string} filePath
 * @returns {Promise}
 */
function readCSV(filePath) {
  return new Promise(accept => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv({ skipLines: 2 }))
      .on("data", data => results.push(data))
      .on("end", () => {
        accept(results);
      });
  });
}

module.exports.readCSV = readCSV;
