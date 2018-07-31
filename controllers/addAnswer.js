var express = require('express')
var app = express()

function fetchQuestion(conn, questionId){
    return new Promise(function(resolve, reject){
        const query = `select id, question from questions where id=${questionId}`;
            console.debug(query);
            conn.query(query, function(err, rows) {
                if(err) {
                    console.error(err);
                    reject(err);
                } else if(rows.length === 1) {
                    resolve(rows.map(_ => { return {question: _.question, id: _.id} }));
                } else {
                    console.error("Probable SQL injection");
                    reject("Probable SQL injection");
                }            
            });
    });
}

app.get('/', function(req, res) {
    // render to views/index.ejs template file
    const questionId =  parseInt(req.query.questionId);
    if (isNaN(questionId)) {
        req.flash('error', 'Invalid Question Id is passed.');
        res.redirect('/companies');
    } else {
        req.getConnection(function(error, conn) {
            if(error) {
                res.flash("error","Connecting while fetching question details");
                res.redirect("/companies");
            } else {
                fetchQuestion(conn, questionId).then(function(questionResult){
                    res.render('addAnswer', {...questionResult[0]});
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