var config = {
    database: {
        host:      'localhost',     // database host
        user:       'root',         // your database username
        password: 'root',         // your database password
        port:       3306,         // default MySQL port
        db:       'feedback'         // your database name
    },
    server: {
        host: '127.0.0.1',
        port: '3000'
    },
    'page-titles': {
        index: "Feedback Analysis",
        register: "Feedback Analysis - Register",
        login: "Feedback Analysis - Login",
        companies : "Feedback Analysis - Companies List"
    }
}
 
module.exports = config