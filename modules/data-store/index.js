'use strict';
const UserSessionManager = require('./user-session-manager');
const config = require('../config');
const jwt = require('jsonwebtoken');
const debug = require('debug')('MockStore');
const util = require('util');
const _ = require('lodash');

module.exports = function () {
    let authenticateUser = (request) => {
        return new Promise((resolve, reject) => {
            //Generate a token
            let jwtPayload = {
                username: request.payload.Username || request.payload.username
            };

            let jwtOptions = {
                expiresIn: '1h'
            };

            let sign = jwt.sign(jwtPayload, config.secret, jwtOptions);
            resolve(sign);
        });
    };

    let getTokenFromRequest = (request) => {
        let token = null;
        debug(`About to get token`);
        if (request.state._t) {
            debug(`_t: ${util.inspect(request.state._t)}`);
        }
        try {
            if (request.headers && request.headers.token) {
                debug(`Getting "token" from header directly: ${request.headers.token}`);
                token = request.headers.token;
            } else if (request.state._t) {
                debug(`Getting token from _t cookie: ${Buffer.from(request.state._t, 'base64').toString()}`);
                token = Buffer.from(request.state._t, 'base64').toString().replace('"', '').replace('"', '');
            } else if (!request.state.authData || !request.state.authData.token) {
                if (request.headers && request.headers.authorization) {
                    debug(`Getting token from auth header: ${request.headers.authorization}`);
                    token = request.headers.authorization;
                }
            } else if (request.state.authData || request.state.authData.token) {
                debug(`Getting token from cookie ${request.state.authData.token}`);
                token = request.state.authData.token;
            }
            else {
                debug(`Can't find token in request ${request}`);
            }
        }
        catch (err) {
            debug(`ERROR: ${err}`);
        }
        debug(`Returning token: ${token}`);
        return token;
    };

    let getUsernameFromRequest = (request) => {
        return new Promise(function (resolve, reject) {
            let token = getTokenFromRequest(request);
            if (!token) {
                var errResponse = '{"name":"JsonWebTokenError","message":"jwt must be provided"}'; //Auth token not found
                reject(JSON.parse(errResponse));
            }
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err || !decoded || !decoded.username) {
                    debug(`Verification problem! error: ${JSON.stringify(err)}; decoded: ${JSON.stringify(decoded)}`);
                    reject(err);
                } else {
                    debug(`Pulled ${decoded.username} from request`);
                    resolve(decoded.username);
                }
            });
        });
    };

    let getUserByUsername = (username) => {
        return UserSessionManager.getSession(username)
            .then(existingSession => {

                // // return the existing session if it was there
                if (existingSession) {
                    debug(`GetUser - Existing session was found for ${username}`);
                    return existingSession;
                }

                // try and pull mock user from repository
                debug(`GetUser - Existing session was NOT found for ${username}. Checking repository...`);
                return MockRepository.get(username)
                    .then(repoUserData => {
                        if (repoUserData && repoUserData.data) {
                            // if we received data from the repository, 
                            debug(`GetUser - Found user ${username} in repository`);
                            return UserSessionManager.addSession(username, repoUserData.data);
                        } else {
                            // if there was no data in repository, generate it 
                            debug(`GetUser - Generating user ${username}`);
                            return MockGenerator.generateMockUser(username)
                                .then(mockUserData => {
                                    // add the data to the repository as temporary and add create a new session
                                    // todo: implement logic to add the temporary generated user to the repository
                                    return UserSessionManager.addSession(username, mockUserData);
                                });
                        }
                    });
            });
    };

    let getUser = (request) => {
        let username = '';
        return getUsernameFromRequest(request)
            .then(resolvedUsername => {
                username = resolvedUsername;
                debug(`GetUser - Getting user ${username}`);
                return getUserByUsername(username);
            });
    };

    return {
        authenticateUser: authenticateUser,
        getUsername: getUsernameFromRequest,
        getUserByUsername: getUserByUsername,
        getUser: getUser,
        
        register: function (server, options, next) {
            // todo: any initialization operations

            next();
        }
    };
}();

module.exports.register.attributes = {
    pkg: require('./package.json')
};