const getData = require('./utils').getData;

const BASE_URL = 'http://127.0.0.1:3000/git';

module.exports = (user_id, auth_token) => {
    let data = [];
    return getData(`${BASE_URL}/users/${user_id}`, auth_token)
        .then(user => {
            data = {
                login: user.login,
                followers: user.followers,
                repos: user.public_repos,
                gists: user.public_gists
            };
            return user.login;
        })
        .then(_ => getReposForUser(user_id, auth_token))
        .then(repos => getLanguageTags(user_id, repos, auth_token))
        .then(langs => {
            data['languages'] = langs;
            return data;
        });
};

const getReposForUser = (user_id, auth_token) => {
    return getData(`${BASE_URL}/repos/${user_id}`, auth_token);
};

const getLanguageTags = (user_id, repos, auth_token) => {
    var repo_results = [];

    for (repo of repos) {
        const a = getData(`${BASE_URL}/repos/${user_id}/${repo.name}/languages`, auth_token);
        repo_results.push(a);
    }

    return Promise.all(repo_results)
        .then(results => {
            const sum_tags = {};
            results.forEach(tags => {
                Object.keys(tags).forEach(tag => {
                    sum_tags[tag] = getOrDefault(sum_tags, tag, 0) + tags[tag];
                });
            });
            return sum_tags;
        });
};

const getOrDefault = (ob, key, def) => {
    if (ob.hasOwnProperty(key)) {
        return ob[key];
    }
    return def;
}