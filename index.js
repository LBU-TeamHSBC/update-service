const github = require('./adapters/github');

const SLEEP_SECONDS = 1;

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
        looper = setTimeout(run, SLEEP_SECONDS * 10000);
    } catch (err) {
        console.log(`Error: ${err}`);
        clearTimeout(looper);
    }
};

const updateUserData = _ => {
    // TODO - Query DB for users with linked accounts
    // TODO - Get last updated for each service
    // TODO - Update as required
    
    // Testing...
    const user_list = [
        'userA', 'userB', 'userC', 'userD', 'userE', 'userF',
        'userG', 'userH', 'userI', 'userJ', 'userK', 'userL'
    ];
    user_list.forEach(user => {
        getDataForUser(342, user, 'IABT8ATYLBYCLYRCA8BRLWGALWIYLW8YRWYL8CRUAWB8Y==')
            .then(data => console.log(user + JSON.stringify(data)))
            .catch(err => console.error("Error: " + err));
    });
}

run()