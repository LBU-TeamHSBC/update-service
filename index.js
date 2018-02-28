const config = require('./config');
const db = require('mysql');

// Adapters
const github = require('./adapters/github');

// Mapping needs to be stored in DB
const provider_map = {
    1: github
};

const getDataForUser = (provider_id, user_id, auth_token) => {
    const promise = provider_map[provider_id](user_id, auth_token);
    return promise;
};

const processData = (student_id, data) => {
    console.log(student_id + ": " + JSON.stringify(data) + "\n");
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

    // const linked_accounts_sql = "\
    //     SELECT sv.student_id, sv.oauth_token, v.id AS vendor_id, v.category \
    //         FROM student_vendor AS sv \
    //         INNER JOIN vendor v ON v.id=sv.vendor_id";
    const linked_accounts_sql = "\
    SELECT u.username, sv.student_id, sv.oauth_token, v.id AS vendor_id, v.category \
        FROM student_vendor AS sv \
        INNER JOIN student s ON s.id=sv.student_id \
        INNER JOIN user u ON u.id=s.user_id \
        INNER JOIN vendor v ON v.id=sv.vendor_id";
    
    // Query DB for users with linked accounts
    conn.query(linked_accounts_sql, (err, results, fields) => {
        results.forEach(link => {
            console.log(link);
            getDataForUser(link.vendor_id, link.username, link.oauth_token)
                .then(data => processData(link.student_id, data))
            .catch(err => console.error("Error: " + err));
        });
    });
}

run()