const loki = require('lokijs');

const db = new loki('users.db')
    , users = db.addCollection('users');

const AUTH_STATE = {
    VALIDATION_REQUIRED: 5,
    VALIDATION_SUCCEED: 1,
    VALIDATION_FAILED: 6
};

/**
 * @param {string} ip
 * @param {string} mac
 * @param {string} token user token
 * @returns {Object} inserted user
 */
function addUser(ip, mac, token) {
    return users.insert({ip: ip, mac: mac, token: token});
}

/**
 * @param {string} token user tokenmodule.
 * @return {Object} user or null
 */
function getUserByToken(token) {
    return users.findOne({'token': token});
}

/**
 * @param {Object} user
 */
function update(user) {
    users.update(user);
}

exports.addUser = addUser;
exports.getUserByToken = getUserByToken;
exports.update = update;
exports.AUTH_STATE = AUTH_STATE;