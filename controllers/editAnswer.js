var express = require('express')
var app = express()

function fetchQuestion(conn, answerId){
    return new Promise(function(resolve, reject){
        const query = `select question, answer from questions join answers a on questions.id = a.questionId where a.id = ${answerId}`;
            console.debug(query);
            conn.query(query, function(err, rows) {
                if(err) {
                    console.error(err);
                    reject(err);
                } else if(rows.length === 1) {
                    resolve(rows.map(_ => { return {question: _.question, answer: _.answer} }));
                } else {
                    console.error("Probable SQL injection");
                    reject("Probable SQL injection");
                }            
            });
    });
}

app.get('/', function(req, res) {
    // render to views/index.ejs template file
    const answerId =  parseInt(req.query.answerId);
    if (isNaN(answerId)) {
        req.flash('error', 'Invalid Answer Id is passed.');
        res.redirect('/companies');
    } else {
        req.getConnection(function(error, conn) {
            if(error) {
                res.flash("error","Connecting while fetching answers");
                res.redirect("/companies");
            } else {
                fetchQuestion(conn, answerId).then(function(questionResult){
                    res.render('editAnswer', {...questionResult[0]});
                }).catch(function(){
                    res.render('index');
                });
            }
        });
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