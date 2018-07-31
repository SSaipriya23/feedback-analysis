var express = require('express')
var app = express()
 
app.get('/', function(req, res) {
    if (req.query.answerId && req.query.questionId){
        req.getConnection(function(error, conn) {
            const answerQuery = `select answer from answers where id=${req.query.answerId}`;
            console.debug(answerQuery);
            conn.query(answerQuery, function(err, rows) {
                if(err) {
                    console.error(err);
                    throw err;
                } else if (rows.length === 1) {
                    const {answer} = rows[0];
                    const updateQuery = `update questions set approvedAnswer= '${answer}' where id=${req.query.questionId}`;
                    conn.query(updateQuery, function(err, rows) {
                        if(err) {
                            console.error(err);
                            throw err;
                        } else {
                            res.redirect("/question?questionId="+req.query.questionId);
                        }
                    });
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