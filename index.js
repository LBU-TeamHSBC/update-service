const config = require('./config');
const db = require('mysql');

// Adapters
const github = require('./adapters/github');

// Mapping needs to be stored in DB
const provider_map = {
    342: github
};

const getDataForUser = (provider_id, user_id, auth_token) => {
    const promise = provider_map[provider_id](user_id, auth_token);
    return promise;
};

const run = _ => {
    var looper;
    try {
        updateUserData();
        looper = setTimeout(run, config.SLEEP_SECONDS * 1000);
    } catch (err) {
        console.log(`Error: ${err}`);
        clearTimeout(looper);
    }
};

const updateUserData = _ => {
    const conn = db.createConnection(config.db);
    conn.connect(err => {
        if (err) {
            console.log(err);
            return;
        }
    });
    // TODO - Query DB for users with linked accounts
    // TODO - Get last updated for each service
    // TODO - Update as required

    conn.query("SELECT * FROM user", (err, results, fields) => {
        results.forEach(user => {
            console.log(user.id + " " + user.username + " " + user.email);
        });
    });
    
    // Testing...
    const user_list = [
        'userA', 'userB', 'userC', 'userD', 'userE', 'userF',
        'userG', 'userH', 'userI', 'userJ', 'userK', 'userL'
    ];
    user_list.forEach(user => {
        getDataForUser(342, user, 'IABT8ATYLBYCLYRCA8BRLWGALWIYLW8YRWYL8CRUAWB8Y==')
            .then(data => console.log(user + ": " + JSON.stringify(data) + "\n"))
            .catch(err => console.error("Error: " + err));
    });
}

run()