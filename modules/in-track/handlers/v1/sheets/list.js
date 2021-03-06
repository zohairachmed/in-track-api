'use strict';
const SheetsRepo = require('../../../../data-store/sheets-repo');
const debug = require('debug')('sheets/list');

module.exports = {
    get: function (req, reply, next) {
        debug(`Getting sheets for whatever user`);

        // SheetsRepo.getAllRows()
        // .then(sheetData => {
        //     if (!sheetData) {
        //         reply().code(404);
        //     } else {
        //         reply(sheetData).code(200);
        //     }
        // })
        // .catch(error => {
        //     reply(error).code(500);
        // });

        SheetsRepo.getAll()
            .then(sheetInfo => {
                if (!sheetInfo) {
                    reply().code(404);
                } else {
                    reply(sheetInfo).code(200);
                }
            })
            .catch(error => {
                reply(error).code(500);
            });
    }
};