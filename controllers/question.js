var express = require('express')
var app = express()
 
app.get('/', function(req, res) {
    const questionId =  parseInt(req.query.questionId);
    if (isNaN(questionId)) {
        req.flash('error', 'Invalid Question ID is passed.');
        res.render('index');
    } else {
        res.render('question', {title: 'Dummy Question'})
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