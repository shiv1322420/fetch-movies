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
                //res.render('index', { list: err.message, title: "softwaress.co", message: "Movie Searching Api" });

            }
            else if (rows.length > 0) {
                //console.log(rows)
                let movieArr=[];
                var data = JSON.stringify(rows);
               // data=JSON.parse(data);
                console.log(data)
                movieArr.push(data);
                //res.render('index', { list: movie_array, title: "softwaress.co", message: "Movie Searching Api" });
                res.render('results',{movieArr:movieArr})

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
                        res.render('results',{movieArr:movieArr})
                        
                        
                        // res.send({
                        //     "Name": data.Title,
                        //     "Id": data.imdbID,
                        //     "Year": data.Year,
                        //     "Director": data.Director,
                        //     "Cast": data.Actors,
                        //     "Rating": data.imdbRating,
                        //     "Image": data.Poster,
                        //     movieArr
                        // });
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
                //res.render('index', { list: err.message, title: "softwaress.co", message: "Movie Searching Api" });

            }
            else if (rows.length > 0) {
                var movieArr = JSON.stringify(rows);
                //res.render('index', { list: movie_array, title: "softwaress.co", message: "Movie Searching Api" });
                res.send({
                    movieArr
                });

            }
            else {
                let query = req.query.search;
                console.log(req.query);
                let movieArr=[];
                var url = 'https://www.omdbapi.com/?s=' + query + '&apikey=b60af205';
                console.log(url)
                request(url, function (error, response, body) {
                    //console.log(body)
                    if (!error && response.statusCode == 200) {
                        var data = JSON.parse(body)
                        for(let i in data)
                        {
                            console.log("-- "+data[i]);
                            movieArr.push(data[i]);
                            
                        }
                        //console.log(data)
                        res.send({
                            movieArr
                        });
                        //res.render('results', {data: data});
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