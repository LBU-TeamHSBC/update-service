const request = require('request');

const getData = (url, auth_token) => {
    return new Promise((resolve, reject) => {
        request.get({
                uri: url,
                headers: { Authorization: `Bearer ${auth_token}` },
                json: true },
            (err, res, data) => {
                if (err) { reject(err); }
                resolve(data);
            });
    });
};

module.exports = { getData };