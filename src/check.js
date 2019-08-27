const https = require("https");
const http = require("http");
const _ = require("lodash");

const timeout = 3000;
let progress = 0;

/**
 * @param {number} count
 */
function printProgress(count) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(count + "%");
}

/**
 * @param {number} total
 */
function oneComplete(total) {
  progress += 1;
  printProgress(Math.round((progress / total) * 100));
}

/**
 * @param {string} link
 * @param {number} total
 * @returns {Promise}
 */
function checkStatusCode(link, total) {
  return new Promise((success, error) => {
    let actualHTTP = null;
    if (link.match(/^http:\/\//)) {
      actualHTTP = http;
    } else {
      actualHTTP = https;
    }

    actualHTTP
      .request(link, { method: "HEAD", timeout: timeout }, response => {
        success({
          link: link,
          code: response.statusCode
        });
        oneComplete(total);
      })
      .on("error", err => {
        success({
          link: "link",
          code: null
        });
        oneComplete(total);
      })
      .end();
  });
}

module.exports.checkStatusCode = checkStatusCode;
