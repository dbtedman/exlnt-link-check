const yargs = require("yargs");
const fs = require("fs");
const https = require("https");
const http = require("http");
const _ = require("lodash");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const readCSV = require("./csv").readCSV;
const checkStatusCode = require("./check").checkStatusCode;

const argv = yargs.option("in").option("out").argv;

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

  const takeLinks = _.uniq(links);

  const total = takeLinks.length;

  Promise.all(
    takeLinks.map(link => {
      return checkStatusCode(link, total);
    })
  )
    .then(data => {
      const keyedVals = [];

      data.forEach(datum => {
        keyedVals[datum.link] = datum.code;
      });

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
            statusExplain:
              status !== undefined
                ? `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${status}`
                : "unknown"
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
          { id: "statusExplain", title: "Status Explanation" }
        ]
      });

      csvWriter.writeRecords(results).then(() => {
        console.log("The CSV file was written successfully");
        process.exit();
      });
    })
    .catch(error => {
      // TODO: Handle this.
      console.error(error);
    });
});
