var express = require('express')
var app = express()

const RENDER_PAGE = 'companies';
const PAGE_TITLE = 'Companies Page';
 
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
                    res.render(RENDER_PAGE, {companies : results.map(_ => { return { id: _.id, name: _.name }} )});
                };            
            });
        });
    } else {
        req.flash("error", "Companies page requires a login");
        res.redirect('/login');
    }
})

app.post('/', function(req, res){
    // Accept POST calls only if we have a logged in user, and the user is either Admin or Senior.
    if (req.session.user && (req.session.user.category === 'Admin' || req.session.user.category === 'Senior')) {
        const companyName = req.body['company-name'];
        const companyProcess = req.body['company-process'];
        req.getConnection(function(error, conn) { 
            const companyInsertQuery = `insert into companies(name, process) values ('${companyName}', '${companyProcess}');`
            console.debug(companyInsertQuery);
            conn.query(companyInsertQuery, function(err, results) {
                if(err) {
                    console.error(err);
                    throw err;
                } else {
                    res.redirect('/companies');
                };            
            });
        });
    } else {
        req.flash("error", "Credentials are Invalid");
        res.render(RENDER_PAGE);
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