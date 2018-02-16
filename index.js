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
        looper = setTimeout(run, SLEEP_SECONDS * 1000);
    } catch (err) {
        console.log(`Error: ${err}`);
        clearTimeout(looper);
    }
};

const updateUserData = _ => {
    getDataForUser(342, 29847295723, 'IABT8ATYLBYCLYRCA8BRLWGALWIYLW8YRWYL8CRUAWB8Y==')
        .then(data => console.log(data))
        .catch(err => console.error("Error: " + err));
}

run()