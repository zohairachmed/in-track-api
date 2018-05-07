'use strict';
const debug = require('debug')('UserSession');
const moment = require('moment');
const _ = require('lodash');

class UserSession {
    constructor(username, dataset) {
        this.username = username;
        this.dataset = dataset;
    }

    getDataset() {
        debug(`Getting datset for ${this.username}`);
        return this.dataset;
    }


    getProfile() {
        // debug(`Getting profile for ${this.username}`);

        // if (!this.dataset) {
        //     throw `User object does not contain a dataset!`;
        // } else if (!this.dataset.profile) {
        //     debug(`User object does not contain profile!`);
        //     debug(`Profile for ${this.username} not found, adding profile to session.`);
        //     this.dataset.profile = ProfileGenerator.generateProfile();
        // }

        // return this.dataset.profile;
    }


    getVersions() {
        // debug(`Getting versions for ${this.username}`);

        // if (!this.dataset) {
        //     throw `User object does not contain a dataset!`;
        // } else if (!this.dataset.versions) {
        //     debug(`User object does not contain versions!`);
        //     debug(`Versions for ${this.username} not found, adding versions to session.`);
        //     this.dataset.versions = ProfileGenerator.generateVersions();
        // }

        // return this.dataset.versions;
    }


    updateTerms(userAcceptedTerms) {
        // var now = moment();
        // let acceptedTimestamp = now.format();
        // let profile = this.getProfile()

        // profile.termsConditionsTimestamp = acceptedTimestamp;
        // profile.termsAndConditionsAccepted = userAcceptedTerms;

        // this.dataset.profile = profile;

        // debug(`Calling db upate now`)
        // try {
        //     debug(`MockStore: ${MockStore}`)
        //     MockStore.updateMockUserPropertyByUsername(this.username, 'profile', this.dataset.profile)
        //         .then(updateData => {
        //             if (updateData) {
        //                 // if we received data from the repository, 
        //                 debug(`Update - Complete`);
        //             }
        //         })
        //         .catch(error => {
        //             debug(`Error! ${JSON.stringify(error)}`);
        //         });
        // }
        // catch (e) {
        //     debug(e);
        // }

        // let response = {
        //     acceptedTimestamp: acceptedTimestamp,
        //     version: "V.01",
        //     accepted: userAcceptedTerms
        // };

        // return response;
    }


    getTxnInfo() {
        debug(`Getting txnInfo for ${this.username}`);
        let ipsumArr = [
            "Bacon ipsum: Bacon swine leberkas, ham hock flank beef veniso",
            "Cat ipsum: Climb leg rub face on everything give attitude nap...",
            "Agency Ipsum: Execute core competencies so that as an end result...",
            "Khaled ipsum: Special cloth alert. Always remember in the jungle...",
            "Coffee ipsum: Irish skinny, grinder affogato, dark, sweet , ...",
            "Cat ipsum: Climb leg rub face on everything give attitude nap...",
            "Cheeseburger Ipsum: Let us wax poetic about the beauty of the cheeseburg...",
            "Zombie ipsum :De braaaiiiins apocalypsi gorger omero prefrontal cortex undead...",
            "Pirate ipsum: Nipperkin run a rig ballast chase Shiver me timber...",
            "Cat ipsum: Climb leg rub face on everything give attitude nap...",
            "Batman ipsum: Breathe in your fears. Face them. To conquer fear,..."
        ];
        var message = ipsumArr[Math.floor(Math.random() * ipsumArr.length)];
        var now = moment();

        let txnInfo = {
            txnId: Math.floor(Math.random() * (5 - 1)) + 1,
            timestamp: now.format(),
            message: message
        };
        return txnInfo;
    }


    paginate(array, start, end) {
        debug(`paginate array length: ${array.length}`);
        //--page_number; // because pages logically start with 1, but technically with 0
        return array.slice(start, start + end);
    }
}

module.exports = UserSession;