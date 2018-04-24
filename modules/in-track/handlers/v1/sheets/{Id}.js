'use strict';
const SheetsRepo = require('../../../../data-store/sheets-repo');
const debug = require('debug')('Editsheets/{Id}');

module.exports = {
    get: function (req, reply, next) {
        let sheetId = req.params.sheetId;

        // MockStore.getMockUser(req)
        //     .then(mockUser => {
        //         if (mockUser.username.indexOf('child') >= 0 || mockUser.username.indexOf('wife') >= 0) {
        //             debug(`Username contains child ${mockUser.username}, returning 403`);
        //             reply('').code(403);
        //         }
        //         else {
        //             debug(`Getting ${lineIdRequired} plan for ${mockUser.username}`);
        //             let plan = mockUser.getPlan(lineIdRequired);
        //             let txnInfo = mockUser.getTxnInfo();

        //             if (plan) {
        //                 plan.txnId = txnInfo.txnId;
        //                 plan.timestamp = txnInfo.timestamp;
        //                 plan.message = txnInfo.message;
        //             }
        //             reply(plan).header('mobile-t', '1518732096-59-VKT9ApzfcFc9_3DOzf05Cw').code(200);
        //         }
        //     })
        //     .catch(error => {
        //         debug(`Error! ${JSON.stringify(error)}`);

        //         if (error.name && (error.name.includes('JsonWebTokenError') || error.name.includes('TokenExpiredError'))) {
        //             reply('').code(401);
        //         }
        //         else {
        //             reply('').code(500);
        //         }
        //     });
        reply('').code(501);
    },
    post: function (req, reply, next) {
        let sheetId = req.params.sheetId;
        let body = req.payload;
        
        console.log(`Getting sheets for whatever user`);
        SheetsRepo.add(sheetId, body)
            .then(sheetInfo => {
                if (!sheetInfo) {
                    reply().code(404);
                } else {
                    reply(sheetInfo).code(200);
                }
            })
            .catch(error => {
                console.log(`ERROR`);
                console.log(error);
                reply(error).code(500);
            });


        // MockStore.getMockUser(req)
        //     .then(mockUser => {
        //         if (mockUser.username.indexOf('child') >= 0 || mockUser.username.indexOf('wife') >= 0) {
        //             debug(`Username contains child ${mockUser.username}, returning 403`);
        //             reply('').code(403);
        //         }
        //         else {
        //             debug(`Getting line id: ${lineIdRequired} plan for ${mockUser.username}`);
        //             let plan = mockUser.getPlan(lineIdRequired);
        //             let oldPlanId = plan.id;

        //             debug(`Got the plan for line id: ${lineIdRequired} for ${mockUser.username}`);
        //             if (newPlanId === "UNLSP001") {                        
        //                 mockUser.setPlan(lineIdRequired, newPlanId);
        //             } else{
        //                 mockUser.setPlanFlag(lineIdRequired, newPlanId);
        //             }

        //             let min = 0;
        //             let max = 100;
        //             let randomIndex = Math.floor(Math.random() * (max - min)) + min;

        //             let planChanges = {};
        //             planChanges.planTo = newPlanId;
        //             planChanges.planFrom = oldPlanId;
        //             planChanges.effectiveDate = plan.effectiveDate;
        //             planChanges.invoiceId = randomIndex;
        //             planChanges.invoiceAmount = "12.0";
        //             let txnInfo = mockUser.getTxnInfo();
        //             if (planChanges) {
        //                 planChanges.txnId = txnInfo.txnId;
        //                 planChanges.timestamp = txnInfo.timestamp;
        //                 planChanges.message = txnInfo.message;
        //             }
        //             reply(planChanges).code(200);

        //         }
        //     })
        //     .catch(error => {
        //         debug(`Error! ${JSON.stringify(error)}`);

        //         if (error.name && (error.name.includes('JsonWebTokenError') || error.name.includes('TokenExpiredError'))) {
        //             reply('').code(401);
        //         }
        //         else {
        //             reply('').code(500);
        //         }
        //     });
    }
};