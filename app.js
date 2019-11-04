var express = require('express');
var request = require('request');
var sqlConnect = require('./connection');
var app = express();
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('search');
});
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('search');
});
let movieArr = [];
app.get('/results', function (req, res) {
    let option = req.query.searchOpt;
    let movieSearch = req.query.search;
    console.log(option)
    if (option == 'movieId') {
        let sqlQuery = `select * from movies where imdbID='${movieSearch}'`;
        sqlConnect.query(sqlQuery, (err, rows, fields) => {
            if (err) {
                console.log(err.message);
                res.render('results',{message:err.message})
            }
            else if (rows.length > 0) {
                let movieArr=[];
                let data = rows;
                movieArr.push(data);
                console.log(movieArr);
                res.render('results',{movieArr:movieArr[0]})

            }
            else {
                let query = req.query.search;
                let movieArr=[];
                console.log(req.query);
                let url = 'https://www.omdbapi.com/?i=' + query + '&apikey=b60af205';
                request(url, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var data = JSON.parse(body)
                        movieArr.push(data);
                        console.log(movieArr)
                        res.render('results',{movieArr:movieArr})
                    }
                })
            }
        });

    }
    else {

        let sqlQuery = `select * from movies where Title like '%${movieSearch}%'`;
        console.log(sqlQuery);
        sqlConnect.query(sqlQuery, (err, rows, fields) => {
            if (err) {
                console.log(err.message);
            }
            else if (rows.length > 0) {
                let data = rows;
                movieArr.push(data);
                console.log(movieArr);
                res.render('results',{movieArr:movieArr[0]})
            }
            else {
                let query = req.query.search;
                console.log(req.query);
                let movieArr=[];
                var url = 'http://www.omdbapi.com/?t=' + query + '&apikey=b60af205';
                console.log(url)
                request(url, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var data = JSON.parse(body)
                        console.log("---body")
                        console.log(body)
                        console.log("---data")
                        console.log(data)
                        movieArr.push(data);
                        res.render('results',{movieArr:movieArr})
                    }
                });
            }
        });

    }

});



// app.get('/results', function(req, res){
//     var query = req.query.search;
//     var url = 'https://www.omdbapi.com/?s=' + query + '&apikey=b60af205';
//     request(url, function(error, response, body){
//         if(!error && response.statusCode == 200){
//             var info = JSON.parse(body)
//             //res.render('results', {data: data});

//             res.status(200).json(
//                 {
//                    message:"success",
//                    info
//                 }
//             )
//         }
//     });
// });

// app.get('/id', function(req, res){
//     var query = req.query.movieId;
//     var url = 'https://www.omdbapi.com/?i=' + query + '&apikey=b60af205';
//     request(url, function(error, response, body){
//         if(!error && response.statusCode == 200){
//             var data = JSON.parse(body)
//             res.render('results', {data: data});
//         }
//     });
// });

app.listen(3002, function () {
    console.log('Movie app started on port: 3002');
});