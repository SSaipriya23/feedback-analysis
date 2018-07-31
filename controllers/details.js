var express = require('express');
var app = express();


const NUM_TOP_QUESTIONS_NUMBER = 5;

function getProcess(conn, companyId) {
    const processQuery = `select name, process from companies where id = ${companyId}`;
    console.debug(processQuery);
    return new Promise(function (resolve, reject) {
        conn.query(processQuery, function (err, results) {
            if (err) {
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

function getQuestions(conn, companyId) {
    const questionsQuery = `select id, question, approvedAnswer from questions where companyId = ${companyId} order by views limit ${NUM_TOP_QUESTIONS_NUMBER}`;
    console.debug(questionsQuery);
    return new Promise(function (resolve, reject) {
        conn.query(questionsQuery, function (err, results) {
            if (err) {
                console.error(err);
                throw err;
            } else {
                resolve(results.map(_ => { return { id: _.id, question: _.question, approvedAnswer: _.approvedAnswer } }));
            }
        });
    });
}


app.get('/details', function (req, res) {
    // render to views/index.ejs template file
    if (req.session.user) {
        req.getConnection(function (error, conn) {
            const companyId = parseInt(req.query.companyId);
            if (isNaN(companyId)) {
                req.flash("error", "Invalid company Id passed to details page, please try again.");
                res.redirect('/companies');
            } else {
                const processPromise = getProcess(conn, companyId);
                const questionsPromise = getQuestions(conn, companyId);
                Promise.all([processPromise, questionsPromise]).then(function (results) {
                    const [{ name, process }, questions] = results;
                    res.render('details', { title: name, process: process, questions: questions, question_section_title: `Top ${NUM_TOP_QUESTIONS_NUMBER} Most view Questions`, session: req.session.user });
                }).catch(function (error) {
                    req.flash("error", "Error while fetching details");
                    res.render('companies');
                });
            }
        });
    } else {
        req.flash("error", "Company Details page requires user to be logged in.");
        res.redirect('/login');
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