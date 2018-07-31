var express = require('express')
var app = express()
 
app.get('/', function(req, res) {
    // render to views/index.ejs template file
    res.render('login');
})
 
app.post('/', function(req, res){
    req.getConnection(function(error, conn) {
        const category = req.body['category'];
        const userid = req.body['userid'];
        const query = `select count(*) count from login where category like '${category}' and userid like '${userid}' and password like '${req.body['password']}'`;
        console.debug(query);
        conn.query(query, function(err, results) {
            if(err) {
                console.log(err);
                throw err;
            } else if (results.length > 0 && results[0].count === 1) {
                console.info("User logged in");
                req.session.user = {category, userid};
                res.redirect("/companies");
            } else {
                req.flash("error", "Credentials are invalid")
                res.render('login');
            };            
        });
    });
});
/** 
 * We assign app object to module.exports
 * 
 * module.exports exposes the app object as a module
 * 
 * module.exports should be used to return the object 
 * when this file is required in another module like app.js
 */ 
module.exports = app;