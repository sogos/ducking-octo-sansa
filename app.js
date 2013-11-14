var port = 3000;

var express = require('express');
var twig = require('twig');

var app = express();

app.set("twig options", {
    strict_variables: false
});

app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'twig')
app.use(express.logger('dev'))

app.use(express.favicon());


app.use(express.static(__dirname + '/public'))
app.use(express.bodyParser());

// Twig.js has support for this using the {% extends parent %} tag
app.set("view options", { layout: false });


app.set('title', 'Sogox Project');


app.get('*', function(req, res, next){
    res.render('homepage/index.twig', { url: req.url });
    return;
});


// app.use(function(req, res, next){
//   res.status(404);

//   // respond with html page
//   if (req.accepts('html')) {
//     res.render('Errors/404.twig', { url: req.url });
//     return;
//   }

//   // respond with json
//   if (req.accepts('json')) {
//     res.send({ error: 'Not found' });
//     return;
//   }

//   // default to plain-text. send()
//   res.type('txt').send('Not found');
// });



app.listen(port);

console.log("Server listening on port: "+port);
