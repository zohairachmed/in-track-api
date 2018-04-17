'use strict';
const MongoProvider = require('../mongo-utils');
const mongoose = require('mongoose');
const debug = require('debug')('MockRepo');

module.exports = function () {
    // define the mock user schema
    const mockUserModelName = 'SpecMobUser';
    let MockUserSchema = new mongoose.Schema({
        username: {
            type: String,
            unique: true,
            required: true,
            dropDups: true
        },
        temporary: {
            type: Boolean,
            required: true,
            default: true
        },
        data: {
            type: Object,
            required: true,
        },
    });
    mongoose.model(mockUserModelName, MockUserSchema);

    let getUser = (username) => {
        let MockUserModel = mongoose.model(mockUserModelName);

        debug(`Getting ${username} from repository`);
        let criteria = {
            username: username
        };
        let query = MockUserModel.findOne(criteria);
        return query.exec()
            .then((queryResponse) => {
                if (queryResponse) {
                    debug(`Found user ${username}`);
                } else {
                    debug(`Unable to find user ${username}`);
                }
                return queryResponse;
            }).catch((error) => {
                debug(`Error retrieving mock account. Error: ${JSON.stringify(error)}`);
                return error;
            });
    };

    let getAllUsers = (temporary) => {
        let MockUserModel = mongoose.model(mockUserModelName);

        debug(`Getting all users from repository (temporary: ${temporary})`);
        let criteria = {
            temporary: temporary
        };
        let query = MockUserModel.find(criteria);

        return query.exec()
            .then((queryResponse) => {
                if (queryResponse) {
                    debug(`Found ${queryResponse.length} users`);
                } else {
                    debug(`Unable to find users!`);
                }
                return queryResponse;
            }).catch((error) => {
                debug(`Error retrieving mock accounts. Error: ${JSON.stringify(error)}`);
                return error;
            });
    };

    let addUser = (username, temporary, data) => {
        let MockUserModel = mongoose.model(mockUserModelName);

        const getOrSave = (repoUser) => {
            if (repoUser) {
                debug(`AddUser - User ${username} already exists in repository`);
                return repoUser;
            }

            debug(`AddUser - Adding user ${username} to repository`);
            let newMockUser = new MockUserModel();
            newMockUser.username = username;
            newMockUser.temporary = temporary;
            newMockUser.data = data;

            let save = newMockUser.save()
                .then((result) => {
                    debug(`Mock user data added to repository: ${JSON.stringify(result.data.user)}`);
                    return result;
                }).catch((error) => {
                    debug(`Error adding user to repository! Username: ${username}; Error: ${JSON.stringify(error)}`);
                    throw error;
                });

            return save;
        };

        return getUser(username)
            .then(getOrSave);
    };

    let updateUser = (username, temporary, data) => {
        const getAndUpdate = (repoUser) => {
            if (!repoUser) {
                throw (`Unable to update user ${username} as it does not exist in the repository`);
            }

            debug(`UpdateUser - Updating user ${username} in repository`);
            if (repoUser.temporary !== temporary) {
                debug(`UpdateUser - Stored value for cache (${repoUser.temporary}) if being updated to ${temporary}`);
            }
            repoUser.temporary = temporary;
            if (data) {
                debug(`UpdateUser - Updating data for user ${username}`);
                repoUser.data = data;
            }

            let update = repoUser.save()
                .then((result) => {
                    debug(`User ${username} updated in repository`);
                    return result;
                }).catch((error) => {
                    debug(`Error updating user in repository! Username: ${username}; Error: ${JSON.stringify(error)}`);
                    throw error;
                });

            return update;
        };

        return getUser(username)
            .then(getAndUpdate);
    };

    let deleteAllUsers = (temporary) => {
        return getAllUsers(temporary)
            .then((repoUsers) => {
                debug(`Deleting ${repoUsers.length} users from repository`);

                // create a collection of promises for removing the users
                let removePromises = [];
                for (let i = 0; i < repoUsers.length; i++) {
                    if (repoUsers[i].username) {
                        let removePromise = deleteUser(repoUsers[i].username);
                        removePromises.push(removePromise);
                    } else {
                        debug(`WARNING: Removing found a repository user using getAll() but it doesn't have a username: ${JSON.stringify(repoUsers[i])}`);
                    }
                }

                return Promise.all(removePromises);
            });
    };

    let deleteUser = (username) => {
        let MockUserModel = mongoose.model(mockUserModelName);

        debug(`Deleting ${username} from repository`);
        let criteria = {
            username: username
        };
        const remove = MockUserModel.remove(criteria)
            .then((result) => {
                debug(`Deleted mock user for username ${username}. Result: ${JSON.stringify(result)}`);
                return result;
            }).catch((error) => {
                debug(`Error deleting mock user for username ${username}. Error: ${JSON.stringify(error)}`);
                throw error;
            });

        return remove;
    };

    return {
        get: (username) => {
            return MongoProvider.connectionPromise.then(() => {
                return getUser(username);
            });
        },
        getAll: (temporary) => {
            return MongoProvider.connectionPromise.then(() => {
                return getAllUsers(temporary);
            });
        },
        add: (username, temporary, data) => {
            return MongoProvider.connectionPromise.then(() => {
                return addUser(username, temporary, data);
            });
        },
        update: (username, temporary, data) => {
            return MongoProvider.connectionPromise.then(() => {
                return updateUser(username, temporary, data);
            });
        },
        deleteAll: (temporary) => {
            return MongoProvider.connectionPromise.then(() => {
                return deleteAllUsers(temporary);
            });
        },
        delete: (username) => {
            return MongoProvider.connectionPromise.then(() => {
                return deleteUser(username);
            });
        }
    };
}();