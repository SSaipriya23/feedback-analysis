var express = require('express')
var app = express()
 
app.get('/', function(req, res) {
    // render to views/index.ejs template file
    console.log(req.session.user);
    res.render('register', {title: 'My Node.js Application', session: req.session.user})
})
 
app.post('/', function(req, res){
    req.getConnection(function(error, conn) {
        const query = `Insert into login (category,userid,name,password) values ('${req.body['category']}','${req.body['userid']}','${req.body['name']}','${req.body['password']}')`;
        console.log(query);
        conn.query(query, function(err, rows, fields) {
            if(err) {
                console.log(err);
                throw err;
            } else {
                res.redirect("/login");
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