/*!
 * febby
 * Copyright(c) 2017 Vasu Vanka
 * MIT Licensed
 */
/**
 * @private
 * Dependency modules
 */
const Cerror = require('./errors');
const ObjectId = require('mongoose').Types.ObjectId;
/**
 * @private
 * @class
 * @description init the custom error class to utilize predefined errors.
 */
let error = new Cerror();
/**
 * @ignore
 * @param { object } req- Express Request Obejct
 * @param { object } res- Express Response Object
 * @param { function } next - Express Next callback
 * @description Validates each and every method with specific valid rules
 */
module.exports.requestValidator = (req, res, next) => {
    let method = req.method;
    if (!req.is('application/json') && (method == 'POST' || method == 'PUT')) {
        return next(error.get400());
    }
    if (method == 'GET' || method == 'POST' || method == 'PUT' || method == 'DELETE')
        return next();
    else {
        return next(error.get405());
    }
};
/**
 * @ignore
 * @param { object } req- Express Request Obejct
 * @param { object } res- Express Response Object
 * @param { function } next - Express Next callback
 * @description Validates Object Id
 */
module.exports.validateObjectId = (req, res, next, id) => {
    if (!ObjectId.isValid(id)) {
        return next(error.getError(400, 'INVALID ID'));
    }
    if (!req.pModel) {
        return next(error.get400());
    }
    next();
};
