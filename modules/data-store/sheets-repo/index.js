'use strict';
const MongoProvider = require('../mongo-utils');
const mongoose = require('mongoose');
const debug = require('debug')('AccountRepo');
const _ = require('lodash');

module.exports = function () {
    debug('AccountRepo - Initializing repository');

    const sheetInfoModelName = 'IntrackSheets';

    let SheetDataSchema = new mongoose.Schema({
        rowId: {
            type: Number,
            required: true
        },
        inventory: {
            type: Number,
            required: false,
            default: 0
        },
        title: {
            type: String,
            required: true
        },
        listingPrice: {
            type: mongoose.Schema.Types.Decimal128,
            required: false
        },
        supplierName: {
            type: String,
            required: false
        },
        supplierPrice: {
            type: mongoose.Schema.Types.Decimal128,
            required: false
        },
        listingFee: {
            type: mongoose.Schema.Types.Decimal128,
            required: false
        },
        tax: {
            type: mongoose.Schema.Types.Decimal128,
            required: false
        },
        shipping: {
            type: mongoose.Schema.Types.Decimal128,
            required: false
        },
        profit: {
            type: mongoose.Schema.Types.Decimal128,
            required: false
        },
        profitMargin: {
            type: mongoose.Schema.Types.Decimal128,
            required: false
        },
        listingUrl: {
            type: String,
            required: false
        },
        supplierUrl: {
            type: String,
            required: false
        },
    });

    let SheetInfoSchema = new mongoose.Schema({
        sheetId: {
            type: String,
            unique: true,
            required: true,
            dropDups: true
        },
        sheetName: {
            type: String,
            required: true
        },
        sheetDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        sheetNotes: {
            type: String,
            required: false
        },
        active: {
            type: Boolean,
            required: false,
            default: true
        },
        updated: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            default: Date.now
        },
        createdBy: {
            type: String,
            required: true
        },
        data: [SheetDataSchema]
    });

    mongoose.model(sheetInfoModelName, SheetInfoSchema);


    let getAllSheets = () => {
        let SheetInfoModel = mongoose.model(sheetInfoModelName);

        const getAllQuery = SheetInfoModel.find({}).then((result) => {
            debug(`Retrieved ${result.length} sheets`);
            return result;
        }).catch((error) => {
            debug(`Error retrieving sheets. Error: ${JSON.stringify(error)}`);
            return error;
        });

        return getAllQuery;
    };


    let getSheet = (sheetId) => {
        let SheetInfoModel = mongoose.model(sheetInfoModelName);

        debug(`Getting ${sheetId} from repository`);
        let criteria = {
            sheetId: sheetId
        };
        let query = SheetInfoModel.findOne(criteria);
        return query.exec()
            .then((queryResponse) => {
                if (queryResponse) {
                    debug(`Found sheet with name ${sheetId}`);
                } else {
                    debug(`Unable to find sheet with id ${sheetId}`);
                }
                return queryResponse;
            });
    };


    let addSheet = (sheetId, data) => {
        let SheetInfoModel = mongoose.model(sheetInfoModelName);

        const getOrCreate = (sheetInfo) => {
            if (sheetInfo) {
                debug(`AddSheet - Sheet with GUID ${sheetId} already exists in repository`);
                return sheetInfo;
            }

            debug(`AddSheet - Adding account ${sheetId} to repository`);
            let newSheetInfo = new SheetInfoModel();
            newSheetInfo.sheetId = data.sheetId;
            newSheetInfo.sheetName = data.sheetName;
            newSheetInfo.sheetDate = data.sheetDate;
            newSheetInfo.sheetNotes = data.sheetNotes;
            newSheetInfo.active = data.active;
            newSheetInfo.updated = data.updated;
            newSheetInfo.updatedBy = data.updatedBy;
            newSheetInfo.created = data.created;
            newSheetInfo.createdBy = data.createdBy;

            // hands on table data
            newSheetInfo.data = [];
            if (data.Handsondata && data.Handsondata.length) {
                _.times(data.Handsondata.length, function (i) {
                    //for (let i = 0; i < data.Handsondata.length; i++) {
                    newSheetInfo.data.push({
                        rowId: data.Handsondata[i].rowId || i,
                        inventory: data.Handsondata[i].Inventory || 0,
                        title: data.Handsondata[i].Title || '',
                        listingPrice: data.Handsondata[i].AmazonListingPrice || 0,
                        supplierName: data.Handsondata[i].SupplierName || 0,
                        supplierPrice: data.Handsondata[i].SupplierPrice || 0,
                        listingFee: data.Handsondata[i].AmazonFee || 0,
                        tax: data.Handsondata[i].Taxes || 0,
                        shipping: data.Handsondata[i].ShippingFee || 0,
                        profit: data.Handsondata[i].Profit || 0,
                        profitMargin: data.Handsondata[i].ProfitMargin || 0,
                        listingUrl: data.Handsondata[i].AmazonUrl || '',
                        supplierUrl: data.Handsondata[i].SupplierUrl || ''
                    });
                });
            }

            debug(`Adding sheet: ${JSON.stringify(newSheetInfo)}`);
            let save = newSheetInfo.save()
                .then((result) => {
                    debug(`Sheet added to repository: ${JSON.stringify(result)}`);
                    return getSheet(result.sheetId);
                }).catch((error) => {
                    debug(`Error adding sheet to repository! Error: ${JSON.stringify(error)}`);
                    throw error;
                });
            return save;
        };

        return getSheet(sheetId)
            .then(getOrCreate);
    };

    let updateSheet = (sheetId, data) => {
        const update = (sheetInfo) => {
            if (!sheetInfo) {
                throw (`Unable to update sheet ${sheetId} as it does not exist in the repository`);
            }

            debug(`UpdateAccount - Updating account ${sheetId} in repository`);
            console.log(sheetInfo);
            if (data) {
                debug(`UpdateSheet - Updating data for account ${accountGUID}`);
                // sheetInfo.name = data.name;
                // sheetInfo.description = data.description;

                // sheetInfo.sheetId = data.sheetId;
                sheetInfo.sheetName = data.sheetName;
                sheetInfo.sheetDate = data.sheetDate;
                sheetInfo.sheetNotes = data.sheetNotes;
                sheetInfo.active = data.active;
                sheetInfo.updated = data.updated;
                sheetInfo.updatedBy = data.updatedBy;
                sheetInfo.created = data.created;
                sheetInfo.createdBy = data.createdBy;

                // // contacts
                // repoAccount.contacts = [];
                // if (data.contacts && data.contacts.length) {
                //     for (let i = 0; i < data.contacts.length; i++) {
                //         repoAccount.contacts.push({
                //             contactType: data.contacts[i].contactType,
                //             firstName: data.contacts[i].firstName,
                //             lastName: data.contacts[i].lastName,
                //             phoneNumber: data.contacts[i].phoneNumber,
                //             email: data.contacts[i].email,
                //         });
                //     }
                // }

                // // hands on table data
                // newSheetInfo.data = [];
                // if (data.Handsondata && data.Handsondata.length) {
                //     _.times(data.Handsondata.length, function (i) {
                //         //for (let i = 0; i < data.Handsondata.length; i++) {
                //         newSheetInfo.data.push({
                //             rowId: data.Handsondata[i].rowId || i,
                //             inventory: data.Handsondata[i].Inventory || 0,
                //             title: data.Handsondata[i].Title || '',
                //             listingPrice: data.Handsondata[i].AmazonListingPrice || 0,
                //             supplierName: data.Handsondata[i].SupplierName || 0,
                //             supplierPrice: data.Handsondata[i].SupplierPrice || 0,
                //             listingFee: data.Handsondata[i].AmazonFee || 0,
                //             tax: data.Handsondata[i].Taxes || 0,
                //             shipping: data.Handsondata[i].ShippingFee || 0,
                //             profit: data.Handsondata[i].Profit || 0,
                //             profitMargin: data.Handsondata[i].ProfitMargin || 0,
                //             listingUrl: data.Handsondata[i].AmazonUrl || '',
                //             supplierUrl: data.Handsondata[i].SupplierUrl || ''
                //         });
                //     });
                // }

                //debug(`Incoming data: ${JSON.stringify(data)}; Updated Account: ${JSON.stringify(repoAccount)}`);
            }

            let persistUpdate = sheetInfo.save()
                .then((result) => {
                    debug(`Sheet ${sheetId} updated in repository`);
                    //return getAccount(result.portalAccountGUID);
                    return getSheet(sheetId);
                }).catch((error) => {
                    debug(`Error updating sheet in repository! SheetId: ${sheetId}; Error: ${JSON.stringify(error)}`);
                    throw error;
                });

            return data;
        };

        return getSheet(sheetId)
            .then(update);
    };

    let deleteSheet = (sheetId) => {
        let SheetInfoModel = mongoose.model(sheetInfoModelName);

        debug(`Deleting Sheet with ${sheetId} from repository`);
        let criteria = {
            sheetId: sheetId
        };
        const remove = SheetInfoModel.remove(criteria)
            .then((result) => {
                debug(`Deleted sheet ${sheetId}. Result: ${JSON.stringify(result)}`);
                return result;
            }).catch((error) => {
                debug(`Error deleting sheet ${sheetId}. Error: ${JSON.stringify(error)}`);
                throw error;
            });

        return remove;
    };





    // define the mock account schema
    const mockAccountModelName = 'Figaro-Entpor-MockAccount';
    let ServiceAccountSchema = new mongoose.Schema({
        legacyCompany: {
            type: String,
            required: true
        },
        serviceAccountId: {
            type: String,
            required: true
        },
        serviceType: {
            type: String,
            required: true
        }
    });

    let ContactSchema = new mongoose.Schema({
        contactType: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: false
        },
        lastName: {
            type: String,
            required: false
        },
        phoneNumber: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        }
    });

    let MockAccountSchema = new mongoose.Schema({
        accountGUID: {
            type: String,
            unique: true,
            required: true,
            dropDups: true
        },
        portalAccountGUID: {
            type: String,
            unique: true,
            required: false, // todo: need to migrate to this after integration
            dropDups: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        streetAddress1: {
            type: String,
            required: false
        },
        streetAddress2: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: false
        },
        state: {
            type: String,
            required: false
        },
        zipCode: {
            type: String,
            required: false
        },
        contacts: [ContactSchema],
        serviceAccounts: [ServiceAccountSchema],
        users: [String]
    });
    mongoose.model(mockAccountModelName, MockAccountSchema);

    let getAccount = (accountGUID) => {
        let MockAccount = mongoose.model(mockAccountModelName);

        debug(`Getting ${accountGUID} from repository`);
        let criteria = {
            accountGUID: accountGUID
        };
        let query = MockAccount.findOne(criteria);
        return query.exec()
            .then((queryResponse) => {
                if (queryResponse) {
                    debug(`Found account with GUID ${accountGUID}`);
                } else {
                    debug(`Unable to find account with GUID ${accountGUID}`);
                }
                return queryResponse;
            });
    };

    let getAccountByName = (accountName) => {
        let MockAccount = mongoose.model(mockAccountModelName);

        debug(`Getting ${accountName} from repository`);
        let criteria = {
            name: accountName
        };
        let query = MockAccount.findOne(criteria);
        return query.exec()
            .then((queryResponse) => {
                if (queryResponse) {
                    debug(`Found account with name ${accountName}`);
                } else {
                    debug(`Unable to find account with name ${accountName}`);
                }
                return queryResponse;
            });
    };

    let addAccount = (accountGUID, data) => {
        let MockAccount = mongoose.model(mockAccountModelName);

        const getOrCreate = (repoAccount) => {
            if (repoAccount) {
                debug(`AddAccount - Account with GUID ${accountGUID} already exists in repository`);
                return repoAccount;
            }

            debug(`AddAccount - Adding account ${accountGUID} to repository`);
            let newRepoAccount = new MockAccount();
            newRepoAccount.accountGUID = accountGUID;
            newRepoAccount.portalAccountGUID = accountGUID;
            newRepoAccount.name = data.name;
            newRepoAccount.description = data.description;

            newRepoAccount.streetAddress1 = data.streetAddress1 || "";
            newRepoAccount.streetAddress2 = data.streetAddress2 || "";
            newRepoAccount.city = data.city || "";
            newRepoAccount.state = data.state || "";
            newRepoAccount.zipCode = data.zipCode || "";


            // contacts
            newRepoAccount.contacts = [];
            if (data.contacts && data.contacts.length) {
                for (let i = 0; i < data.contacts.length; i++) {
                    newRepoAccount.contacts.push({
                        contactType: data.contacts[i].contactType,
                        firstName: data.contacts[i].firstName,
                        lastName: data.contacts[i].lastName,
                        phoneNumber: data.contacts[i].phoneNumber,
                        email: data.contacts[i].email,
                    });
                }
            }

            // service accounts
            newRepoAccount.serviceAccounts = [];
            if (data.serviceAccounts && data.serviceAccounts.length) {
                for (let i = 0; i < data.serviceAccounts.length; i++) {
                    newRepoAccount.serviceAccounts.push({
                        legacyCompany: data.serviceAccounts[i].legacyCompany,
                        serviceAccountId: data.serviceAccounts[i].serviceAccountId,
                        serviceType: data.serviceAccounts[i].serviceType
                    });
                }
            }

            // users
            newRepoAccount.users = data.users;

            debug(`Adding account: ${JSON.stringify(newRepoAccount)}`);
            let save = newRepoAccount.save()
                .then((result) => {
                    debug(`Account added to repository: ${JSON.stringify(result)}`);
                    return getAccount(result.portalAccountGUID);
                }).catch((error) => {
                    debug(`Error adding account to repository! Error: ${JSON.stringify(error)}`);
                    throw error;
                });
            return save;
        };

        return getAccount(accountGUID)
            .then(getOrCreate);
    };

    let updateMockAccount = (accountGUID, data) => {
        const updateAccount = (repoAccount) => {
            if (!repoAccount) {
                throw (`Unable to update account ${accountGUID} as it does not exist in the repository`);
            }

            debug(`UpdateAccount - Updating account ${accountGUID} in repository`);
            if (data) {
                debug(`UpdateAccount - Updating data for account ${accountGUID}`);
                repoAccount.name = data.name;
                repoAccount.description = data.description;

                repoAccount.streetAddress1 = data.streetAddress1 || "";
                repoAccount.streetAddress2 = data.streetAddress2 || "";
                repoAccount.city = data.city || "";
                repoAccount.state = data.state || "";
                repoAccount.zipCode = data.zipCode || "";

                // contacts
                repoAccount.contacts = [];
                if (data.contacts && data.contacts.length) {
                    for (let i = 0; i < data.contacts.length; i++) {
                        repoAccount.contacts.push({
                            contactType: data.contacts[i].contactType,
                            firstName: data.contacts[i].firstName,
                            lastName: data.contacts[i].lastName,
                            phoneNumber: data.contacts[i].phoneNumber,
                            email: data.contacts[i].email,
                        });
                    }
                }

                // service accounts
                repoAccount.serviceAccounts = [];
                for (let i = 0; i < data.serviceAccounts.length; i++) {
                    let newServiceAccount = {
                        legacyCompany: data.serviceAccounts[i].legacyCompany,
                        serviceAccountId: data.serviceAccounts[i].serviceAccountId,
                        serviceType: data.serviceAccounts[i].serviceType
                    };
                    repoAccount.serviceAccounts.push(newServiceAccount);
                }

                // users
                if (data.users && data.users.length && data.users.length > 0) {
                    repoAccount.users = data.users;
                }

                //debug(`Incoming data: ${JSON.stringify(data)}; Updated Account: ${JSON.stringify(repoAccount)}`);
            }

            let persistUpdate = repoAccount.save()
                .then((result) => {
                    debug(`Account ${accountGUID} updated in repository`);
                    //return getAccount(result.portalAccountGUID);
                    return getAccount(accountGUID);
                }).catch((error) => {
                    debug(`Error updating accont in repository! AccountGUID: ${accountGUID}; Error: ${JSON.stringify(error)}`);
                    throw error;
                });

            return persistUpdate;
        };

        return getAccount(accountGUID)
            .then(updateAccount);
    };

    let deleteAccount = (accountGUID) => {
        let MockAccount = mongoose.model(mockAccountModelName);

        debug(`Deleting ${accountGUID} from repository`);
        let criteria = {
            accountGUID: accountGUID
        };
        const remove = MockAccount.remove(criteria)
            .then((result) => {
                debug(`Deleted mock account ${accountGUID}. Result: ${JSON.stringify(result)}`);
                return result;
            }).catch((error) => {
                debug(`Error deleting mock account ${accountGUID}. Error: ${JSON.stringify(error)}`);
                throw error;
            });

        return remove;
    };

    let getAllAccounts = () => {
        let MockAccount = mongoose.model(mockAccountModelName);

        const getAllQuery = MockAccount.find({}).then((result) => {
            debug(`Retrieved ${result.length} mock accounts`);
            return result;
        }).catch((error) => {
            debug(`Error retrieving mock accounts. Error: ${JSON.stringify(error)}`);
            return error;
        });

        return getAllQuery;
    };

    let getAccountsForUser = (username) => {
        let MockAccount = mongoose.model(mockAccountModelName);

        let criteria = {
            users: username
        };

        return MockAccount.find(criteria)
            .then((result) => {
                debug(`Retrieved ${result.length} mock accounts`);
                return result;
            }).catch((error) => {
                debug(`Error retrieving mock accounts. Error: ${JSON.stringify(error)}`);
                return error;
            });
    };

    let deleteAllAccounts = () => {
        // get all of the accounts to be removed and remove them one at a time
        return getAllAccounts()
            .then((repoAccounts) => {
                debug(`Deleting ${repoAccounts.length} accounts from repository`);

                // create a collection of promises for removing the accounts
                let removePromises = [];
                for (let i = 0; i < repoAccounts.length; i++) {
                    if (repoAccounts[i].accountGUID) {
                        let removePromise = deleteAccount(repoAccounts[i].accountGUID);
                        removePromises.push(removePromise);
                    } else {
                        debug(`WARNING: Removing found a repository account using getAll() but it doesn't have an account GUID: ${JSON.stringify(repoAccounts[i])}`);
                    }
                }

                return Promise.all(removePromises);
            });
    };

    return {
        add: (sheetId, data) => {
            return MongoProvider.connectionPromise.then(() => {
                return addSheet(sheetId, data);
            });
        },
        get: (sheetId) => {
            return MongoProvider.connectionPromise.then(() => {
                return getSheet(sheetId);
            });
        },
        // getByName: (accountName) => {
        //     return MongoProvider.connectionPromise.then(() => {
        //         return getAccountByName(accountName);
        //     });
        // },
        update: (sheetId, data) => {
            debug('calling update mock account in repo');

            return MongoProvider.connectionPromise.then(() => {
                debug('calling update mock account in repo');

                return updateSheet(sheetId, data);
            });
        },
        delete: (sheetId) => {
            return MongoProvider.connectionPromise.then(() => {
                return deleteSheet(sheetId);
            });
        },
        getAll: () => {
            return MongoProvider.connectionPromise.then(() => {
                return getAllSheets();
            });
        },
        // getAccountsForUser: (username) => {
        //     return MongoProvider.connectionPromise.then(() => {
        //         return getAccountsForUser(username);
        //     });
        // },
        deleteAll: () => {
            return MongoProvider.connectionPromise.then(() => {
                return deleteAllAccounts();
            });
        }
    };
}();