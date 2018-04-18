const sheetsRepo = require('./sheets-repo');

module.exports = function () {
    let getAllSheets = (request) => {
        return sheetsRepo.getAll();
    };


    return {
        getAllSheets: getAllSheets,
        
        register: function (server, options, next) {
            // todo: any initialization operations

            next();
        }
    };
}();

module.exports.register.attributes = {
    pkg: require('./package.json')
};