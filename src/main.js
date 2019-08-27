const yargs = require("yargs");
const fs = require("fs");
const csv = require("csv-parser");
const https = require("https");
const http = require("http");
const _ = require("lodash");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

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

function printProgress(count) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(count + "%");
}

let progress = 0;
let total = 0;

function oneComplete() {
  progress += 1;
  printProgress(Math.round((progress / total) * 100));
}

function checkStatusCode(link) {
  return new Promise((success, error) => {
    let actualHTTP = null;
    if (link.match(/^http:\/\//)) {
      actualHTTP = http;
    } else {
      actualHTTP = https;
    }

    actualHTTP
      .request(link, { method: "HEAD", timeout: 3000 }, response => {
        success({
          link: link,
          code: response.statusCode
        });
        oneComplete();
      })
      .on("error", err => {
        success({
          link: "link",
          code: null
        });
        oneComplete();
      })
      .end();
  });
}

var argv = yargs.option("in").option("out").argv;

const inFilePath = argv.in;
const outFilePath = argv.out;

fs.accessSync(inFilePath);

readCSV(inFilePath).then(data => {
  const links = [];
  const csvData = data;
  data.forEach(row => {
    const link = row["Link"];

    if (link !== undefined) {
      links.push(link);
    }
  });

  const takeLinks = _.take(_.uniq(links), 50);
  // const takeLinks = _.uniq(links);

  total = takeLinks.length;

  Promise.all(
    takeLinks.map(link => {
      return checkStatusCode(link);
    })
  )
    .then(data => {
      // TODO: Now reconcile data with original links.

      const keyedVals = [];

      data.forEach(datum => {
        keyedVals[datum.link] = datum.code;
      });

      const okStatusCode = [200];

      const results = _.filter(
        csvData.map(datum => {
          const link = datum["Link"];
          const entryId = datum["Entry ID"];
          const entry = `https://app.secure.griffith.edu.au/exlnt/entry/${entryId}/view`;
          const status = keyedVals[datum["Link"]];

          if (
            link === undefined &&
            entryId === undefined &&
            status === undefined
          ) {
            return null;
          }

          return {
            link: link !== undefined ? link : "unknown",
            entry: entryId !== undefined ? entry : "unknown",
            status: status !== undefined ? status : "unknown",
            ok: _.includes(okStatusCode, status) ? "Yes" : "No"
          };
        }),
        value => value !== null
      );

      const csvWriter = createCsvWriter({
        path: outFilePath,
        header: [
          { id: "link", title: "Link" },
          { id: "entry", title: "Entry" },
          { id: "status", title: "Status" },
          { id: "ok", title: "Is Ok?" }
        ]
      });

      csvWriter.writeRecords(results).then(() => {
        console.log("The CSV file was written successfully");
        process.exit();
      });
    })
    .catch(error => {
      // TODO: What to do with error?
    });
});
