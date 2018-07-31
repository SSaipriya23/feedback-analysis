var express = require('express')
var app = express()
 
app.post('/', function(req, res) {
    if (req.body.answer && req.body.questionId && req.body.companyId && (req.body.answerId === undefined)){
        const query = `Insert into answers(answer, questionId) values ('${req.body.answer}',${req.body.questionId})`;
        console.debug(query);
        req.getConnection(function(error, conn) {
            conn.query(query, function(err, rows, fields) {
                if(err) {
                    console.log(err);
                    throw err;
                } else {
                    req.flash("success", "Succesfully submitted you answer.")
                    res.redirect(`/question?questionId=${req.body.questionId}&companyId=${req.query.companyId}`);
                };            
            });
        });
    } else if (req.body.answer && req.body.answerId  && req.body.companyId  && (req.body.answerId !== undefined)){
        const query = `update answers set answer = '${req.body.answer}' where id = ${req.body.answerId}`;
        console.debug(query);
        req.getConnection(function(error, conn) {
            conn.query(query, function(err, rows, fields) {
                if(err) {
                    console.log(err);
                    throw err;
                } else {
                    req.flash("success", "Succesfully submitted you answer.")
                    res.redirect(`/question?questionId=${req.body.questionId}&companyId=${req.query.companyId}`);
                };            
            });
        });
    } else {
        req.flash("error", "Missing required data to perform request.");
        res.redirect("/companies");
    }
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