var express = require('express');
var app = express();

function getProcess(conn, companyId){
    const processQuery = `select name, process from companies where id = ${companyId}`;
    console.debug(processQuery);
    return new Promise(function(resolve, reject){
        conn.query(processQuery, function(err, results) {
            if(err) {
                console.log(err);
                throw err;
            } else if (results.length === 1) {
                resolve({ name: results[0].name, process: results[0].process.split(",") });
            } else {
                console.log(err);
                reject(err);
            };            
        });
    });
}

function getQuestions(conn, companyId){
    const questionsQuery = `select question, approvedAnswer from questions where companyId = ${companyId} limit 5`;
    console.debug(questionsQuery);
    return new Promise(function(resolve, reject){
        conn.query(questionsQuery, function(err, results) {
            if(err) {
                console.error(err);
                throw err;
            } else {
                resolve(results.map(_ => { return { question: _.question, approvedAnswer: _.approvedAnswer } }));
            }           
        });
    });
}

 
app.get('/details', function(req, res) {
    // render to views/index.ejs template file
    
    req.getConnection(function(error, conn) {
        try {
            const companyId =  parseInt(req.query.companyId);
            const processPromise = getProcess(conn, companyId);
            const questionsPromise = getQuestions(conn, companyId);
            Promise.all([processPromise, questionsPromise]).then(function(results){
                const [{name, process}, questions] = results;
                console.log(JSON.stringify({ title: name, process: process, questions: questions}));
                res.render('details', { title: name, process: process, questions: questions});
            }).catch(function(error){
                res.render('companies', {title: 'Companies', errorMessage: 'Error while fetching details'});
            });
        } catch {
            res.render('companies', {title: 'Companies', errorMessage: 'Invalid company Id'});
        }
    });

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