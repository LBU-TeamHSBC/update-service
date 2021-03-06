const getData = require('./utils').getData;
const getOrDefault = require('./utils').getOrDefault;

const BASE_URL = 'http://127.0.0.1:3000/git';

const getReposForUser = (user_id, auth_token) => {
    return getData(`${BASE_URL}/repos/${user_id}`, auth_token);
};

const processRepos = (user_id, auth_token, repos) => {
    let data = [];
    let done = 0;
    return new Promise((resolve, reject) => {
        repos.forEach(repo => {
            const repo_stats = {};
            getLanguageTags(user_id, repo, auth_token)
            .then(langs => {
                Object.assign(repo_stats, {
                    id: repo.id,
                    name: repo.name,
                    rating: repo.stars,
                    created: repo.created_at.split('T')[0],
                    updated: repo.updated_at.split('T')[0],
                    lines_of_code: 0
                });
                repo_stats['tags'] = {};
                repo_stats['lines_of_code'] = Object.keys(langs).reduce((a,b)=>a+=langs[b],0)
                Object.keys(langs).forEach(lang => {
                    repo_stats['tags'][lang] = parseInt(langs[lang] / repo_stats['lines_of_code'] * 100);
                });
            })
            .then(_ => {
                data.push(repo_stats);
                if (++done == repos.length) {
                    resolve(data);
                }
            });
        });
    });
};

const getLanguageTags = (user_id, repo, auth_token) => {
    return getData(`${BASE_URL}/repos/${user_id}/${repo.name}/languages`, auth_token);
};

module.exports = (user_id, auth_token) => {
    return getData(`${BASE_URL}/users/${user_id}`, auth_token)
    .then(_ => getReposForUser(user_id, auth_token))
    .then(repos => processRepos(user_id, auth_token, repos));
};