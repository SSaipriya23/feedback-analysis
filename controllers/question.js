var express = require('express');
var app = express();


function fetchQuestion(conn, questionId){
    return new Promise(function(resolve, reject){
        const query = `select question, approvedAnswer, views from questions where id=${questionId}`;
            console.debug(query);
            conn.query(query, function(err, rows) {
                if(err) {
                    console.error(err);
                    reject(err);
                } else if(rows.length === 1) {
                    resolve(rows.map(_ => { return {views: _.views, approvedAnswer: _.approvedAnswer, question: _.question} }));
                } else {
                    console.error("Probable SQL injection");
                    reject("Probable SQL injection");
                }            
            });
    });
}

function fetchAnswers(conn, questionId){
    return new Promise(function(resolve, reject){
        const query = `select id, answer from answers where questionId=${questionId}`;
            console.debug(query);
            conn.query(query, function(err, rows) {
                if(err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(rows.map(_ => { return {id: _.id, answer: _.answer}}));
                };            
            });
    });
}

app.get('/', function(req, res) {
    const questionId =  parseInt(req.query.questionId);
    if (isNaN(questionId)) {
        req.flash('error', 'Invalid Question Id is passed.');
        res.redirect('/companies');
    } else {
        req.getConnection(function(error, conn) {
            const questionPromise = fetchQuestion(conn, questionId);
            const answersPromise =  fetchAnswers(conn, questionId);
            Promise.all([questionPromise, answersPromise]).then(function(results){
                res.render('question', {...results[0][0], answers: results[1], title: results[0][0].question});
            }).catch(function(error){
                res.flash("error",error);
                res.render('index');
            });
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