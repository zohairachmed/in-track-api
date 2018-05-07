'use strict';
const UserSession = require('./userSession.js');
const debug = require('debug')('USM');
const _ = require('lodash');

module.exports = function () {
    debug('Initializing user factory');
    const sessions = [];

    let hasSession = function (username) {
        return new Promise(function (resolve, reject) {
            try {
                const un = _.toUpper(_.get(username));
                const foundSession = _.find(sessions, item => _.toUpper(_.get(item.username)) === un);
                const found = foundSession ? true : false;

                resolve(found);
            }
            catch (e) {
                debug(String(e));
                resolve(null);
            }
        });
    };

    let getSession = function (username) {
        return new Promise(function (resolve, reject) {
            debug(`Checking for existing sessions for ${username}`);
            try {
                const un = _.toUpper(_.get(username));
                const foundSession = _.find(sessions, item => _.toUpper(_.get(item.username)) === un);
                resolve(foundSession);
            }
            catch (e) {
                debug(String(e));
                resolve(null);
            }
        });
    };

    let addSession = function (username, userDataset) {
        return new Promise(function (resolve, reject) {
            if (userDataset) {
                debug(`Creating user session for ${username}`);
                let newUserSession = new UserSession(username, userDataset);
                if (!newUserSession) {
                    reject(`Unable to create user object from dataset ${JSON.stringify(userDataset)}`);
                } else {
                    debug(`User object created for ${username}`);
                    sessions.push(newUserSession);
                    resolve(newUserSession);
                }
            } else {
                reject('Unable to add a session for a null dataset');
            }
        });
    };

    let invalidateUserSession = function (username) {
        return new Promise(function (resolve, reject) {
            let found = false;
            for (let i = 0; i < sessions.length; i++) {
                let userSession = sessions[i];
                if (username) {
                    if (userSession.username.toUpperCase() === username.toUpperCase()) {
                        debug(`Removing existing session for ${username}`);
                        sessions.splice(i, 1);
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                reject(`Unable to invalide a session for ${username}--not found`);
            } else {
                resolve(found);
            }
        });
    };

    return {
        addSession: addSession,
        getSession: getSession,
        hasSession: hasSession,
        invalidateUserSession: invalidateUserSession
    };
}();