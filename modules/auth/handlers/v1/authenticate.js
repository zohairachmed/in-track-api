'use strict';
const Repo = require('../../../data-store/repository');
const debug = require('debug')('v1/authenticate');

module.exports = {
    post: function (req, reply, next) {
        let body = req.payload;
        
        console.log(`Username is ${body.username} and passsword is ${body.password}`);
 
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
        //reply('').code(501);
    }
};