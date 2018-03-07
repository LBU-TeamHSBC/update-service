const getData = require('./utils').getData;
const getOrDefault = require('./utils').getOrDefault;

const BASE_URL = 'http://127.0.0.1:3000/lbu';

const getCourseForUser = (user_id, auth_token) => {
    return getData(`${BASE_URL}/course/${user_id}`, auth_token);
};

const processCourses = (user_id, auth_token, courses) => {
    var data = [];
    var done = 0;
    return new Promise((resolve, reject) => {
        courses.forEach(course => {
            const course_stats = {};
            getCourseTags(user_id, course, auth_token).then(modules => {
                Object.assign(course_stats, {
                    id: course.id,
                    name: course.name,
                    rating: course.rating,
                    participant_count: course.participant_count,
                    progress: student_course.progress,
                    modules:{
                        id:course_module.id,
                        name:course_module.name,
                        weighting:course_module.weighting,
                        progress:student_course_module.progress                        
                    }
                });
                course_stats['tags'] = modules;
                Object.values(modules).forEach(module => {
                    course_stats['module']+=progress;
                });

            }).then(_ => {
                data.push(course_stats);
                if (++done == courses.length) {
                    resolve(data);
                }
            });
        });
    });
};
