const config = require('./config');
const db = require('mysql');

// Adapters
const github = require('./adapters/github');

// Mapping needs to be stored in DB
const provider_map = {
    1: github
};

const conn = db.createConnection(config.db);

const getDataForUser = (provider_id, user_id, auth_token) => {
    const promise = provider_map[provider_id](user_id, auth_token);
    return promise;
};

const processData = (vendor_id, student_id, category, data) => {

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
            console.log("LINK::", link);
            getDataForUser(link.vendor_id, link.student_id, link.oauth_token)
                .then(data => {
                        // STORE DATA IN DB
                        console.log("StudentId: " + link.student_id);
                        if (link.category === 'PROJECT') {
                            for (let project of data) {
                                var sql = `INSERT INTO student_project (
                                        student_id, vendor_id, project_id, name,
                                        rating, lines_of_code, created_at, updated_at
                                    ) VALUES (
                                        ${link.student_id}, ${link.vendor_id}, ${project.id},
                                        '${project.name}', ${project.rating}, ${project.lines_of_code},
                                        '${project.created}', '${project.updated}'
                                    )`;
                                console.log("PROJECT>>>> " + JSON.stringify(project));
                    
                                // Insert project into DB
                                conn.query(sql, (err, projResult, fields) => {
                                    if (err) {
                                        console.log("Error running: " + sql);
                                        console.log(err.sqlMessage);
                                        return;
                                    }

                                    // Insert tags for project into DB
                                    insertTags(projResult.insertId, project.tags);
                                });
                            }
                        } else if (link.category === 'COURSE') {
                            console.log("COURSE" + link.student_id + ": " + JSON.stringify(data) + "\n");
                        }
                }) //processData(link.vendor_id, link.student_id, link.category, data))
            .catch(err => console.error("Error: " + err));
        });
    });
}

const insertTags = (project_id, tags) => {
    for (let tag in tags) {
        console.log("Checking: " + tag);
        const weighting = tags[tag];
        conn.query(`SELECT id FROM tag WHERE name='${tag}'`, (err, results, fields) => {
            if (err) {
                return;
            }
            // If tag not in DB add it
            if (results.length === 0) {
                console.log("Add tag: " + tag);
                conn.query(`INSERT INTO tag (name) VALUES ('${tag}')`, (err, tag_result, fields) => {
                    if (err) {
                        console.log("add tag: ", err.sqlMessage);
                        return;
                    }
                    const tag_id = tag_result.insertId;
                    insertTag(project_id, tag_id, weighting);
                })
            } else {
                console.log("Tag exists: " + tag);
                const tag_id = results[0].id;
                insertTag(project_id, tag_id, weighting);
            }
        })
    }
};

const insertTag = (project_id, tag_id, weighting) => {
    const tag_sql = `INSERT INTO student_project_tag (
        student_project_id,
        tag_id,
        weighting
    ) VALUES (
        ${project_id},
        ${tag_id},
        ${weighting}
    )`;

    conn.query(tag_sql, (err, results, fields) => {
        if (err) {
            console.log("Error inserting tag: ", err.sqlMessage);
        } else {
            console.log("Added: ", project_id, tag_id, weighting);
        }
    });
};


run()