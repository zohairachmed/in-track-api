'use strict';
const debug = require('debug')('mocks');
const cheerio = require('cheerio');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = {
    get: function (req, reply, next) {

        let url = req.query.url;
        var response = {
            minimumInventory: 0
        };

        if (url && url.toLowerCase().indexOf('walmart') < 0) {
            debug(`url ${url}, does not contain walmart`);
            reply(response).code(200);
        }
        else {
            debug(`About to load the url ${url}`);
            JSDOM.fromURL(url, {

                referrer: "https://google.com/",

                userAgent: "Mellblomenator/9000",
                includeNodeLocations: true
            }).then(dom => {
                debug(`Time to cerealize`);
                var document = dom.serialize();

                debug(`Serialization is done. About to load the doc`);

                var ch = cheerio.load(document, { decodeEntities: true });

                let totalNumberOfItems = 0;

                var urgencyMsg = ch(".prod-ProductOffer-urgencyMsg").html();

                if (urgencyMsg && urgencyMsg.length > 0) {
                    console.log(`Urgency Message: ${urgencyMsg}`);
                    let finalResponse = urgencyMsg.replace(/[^0-9]/g, '');
                    console.log(finalResponse);
                    response.minimumInventory = finalResponse;
                }
                else {
                    ch(".visuallyhidden option").each(function (i, elem) {
                        if (!isNaN(ch(elem).val())) {
                            debug(`Item  ${i}: ${ch(elem).val()}`);
                            totalNumberOfItems += 1;
                        }
                    });

                    debug(`Total number of items: ${totalNumberOfItems}`);

                    response.minimumInventory = totalNumberOfItems;
                }

                reply(response).code(200);

            }).catch(error => {
                debug(`${error}`);
                reply().code(500);
            });
        }
    }
};