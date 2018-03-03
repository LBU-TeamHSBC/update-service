const getData = require('./utils').getData;
const getOrDefault = require('./utils').getOrDefault;

const BASE_URL = 'http://127.0.0.1:3000/lbu';

const getCourseForUser = (user_id, auth_token) => {
    return getData(`${BASE_URL}/course/${user_id}`, auth_token);
};

const processCourses = (user_id, auth_token, courses) => {
    let data = [];
    let done = 0;
    return new Promise((resolve, reject) => {
        courses.forEach(course => {
            const course_stats = {};
            getCourseTags(user_id, course, auth_token)
            .then(courses => {
                Object.assign(course_stats, {
                    id: course.id,
                    name: course.name,
                });
            });
        });
    });
};
