var express = require('express')
var app = express()
 
app.get('/', function(req, res) {
    // render to views/index.ejs template file
    if (req.session.user) {
        req.getConnection(function(error, conn) {
            const query = 'select id, name from companies;'
            console.log(query);
            conn.query(query, function(err, results) {
                if(err) {
                    console.log(err);
                    throw err;
                } else {
                    console.log(results);
                    console.log(results.map(_ => _.name));
                    res.render('companies', {title: 'Companies', companies : results.map(_ => { return { id: _.id, name: _.name }} ), session: req.session.user });
                };            
            });
        });
    } else {
        res.render('login', {title: 'Login', errorMessage: 'Companies page requires a login.'});
    }
})

app.post('/', function(req, res){
    if (req.session.user && (req.session.user.category === 'Admin' || req.session.user.category === 'Senior')) {
        
    }
})

app.get('/details', function(req, res){
    res.send("details");
})
 
/** 
 * We assign app object to module.exports
 * 
 * module.exports exposes the app object as a module
 * 
 * module.exports should be used to return the object 
 * when this file is required in another module like app.js
 */ 
module.exports = app;