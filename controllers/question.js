var express = require('express');
var app = express();


function fetchQuestion(conn, questionId, companyId){
    return new Promise(function(resolve, reject){
        const query = `select question, approvedAnswer from questions where id=${questionId} and companyId=${companyId}`;
            console.debug(query);
            conn.query(query, function(err, rows) {
                if(err) {
                    console.error(err);
                    reject(err);
                } else if(rows.length === 1) {
                    resolve(rows.map(_ => { return {approvedAnswer: _.approvedAnswer, question: _.question} }));
                } else {
                    console.error("Probable SQL injection");
                    reject("Probable SQL injection");
                }            
            });
    });
}

function fetchAnswers(conn, questionId){
    return new Promise(function(resolve, reject){
        const query = `select answer from answers where questionId=${questionId}`;
            console.debug(query);
            conn.query(query, function(err, rows) {
                if(err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(rows.map(_ => _.answer));
                };            
            });
    });
}

app.get('/', function(req, res) {
    const questionId =  parseInt(req.query.questionId);
    const companyId =  parseInt(req.query.companyId);
    if (isNaN(questionId) || isNaN(companyId)) {
        req.flash('error', 'Invalid Question Id/ Company Id is passed.');
        res.redirect('/companies');
    } else {
        req.getConnection(function(error, conn) {
            const questionPromise = fetchQuestion(conn, questionId, companyId);
            const answersPromise =  fetchAnswers(conn, questionId);
            Promise.all([questionPromise, answersPromise]).then(function(results){
                res.render('question', {...results[0][0], answers: results[1]});
            }).catch(function(){
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