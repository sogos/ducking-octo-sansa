var port = 3000;

var express = require('express');
var twig = require('twig');
var app = express();
var Sequelize = require("sequelize");

var sequelize = new Sequelize('nodejs', 'root', 'En954Rmbde!!', {
  host: "localhost",
  port: 3306,
  logging: false,
  dialect: 'mysql'
})

var Post = sequelize.define('Post', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
  },
  content: {
    type: Sequelize.TEXT,
  }
})
Post.sync({force: true});

app.set("twig options", {
  strict_variables: false
});

app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'twig');
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.cookieSession({ secret: 'aa'}));


app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.session());


// app.use(function(req, res, next){
//   next();
// });

app.use(function(req, res, next) {

  req.models = {};
  req.models.Post = Post;
  next();
});

app.use(express.csrf());

app.use(function(req, res, next){
  res.locals.token = req.csrfToken();
  next();
});

app.use(app.router);
app.use(express.compress());
app.use(express.methodOverride());



// Error Handling

app.use(function(err, req, res, next){
  console.error(err.stack);
  if(err.status == "403") {
    res.send(err.status, "Oops.. Access Denied");
  } else {
    res.send(err.status, "Oops... Something is broken");
  }
});



// Twig.js has support for this using the {% extends parent %} tag
app.set("view options", { layout: false });

app.set('title', 'Sogox Project');


app.all('/post/new', function(req, res, next){
  if(typeof req.body.title === 'undefined' || typeof req.body.content === 'undefined') {
   //res.json(406,{ error: 'One field is missing..' });
   return res.render('post/new.twig', { url: req.url, csrf: res.locals.token });
 } else if(req.body.title == '' || req.body.content == '') {
   //res.json(406,{ error: 'One value is empty..' });
   return res.render('post/new.twig', { url: req.url, csrf: res.locals.token });
 } else {
  req.models.Post.create({ title: req.body.title, content: req.body.content })
  .success(function(post) {
    //res.json(201,{ 'project': project });
    res.redirect(301, '/');
    return ;
  })
  .error(function(err) {
    console.log(err);
    //res.json(406,{ error: err.message });
    return res.render('post/new.twig', { url: req.url, csrf: res.locals.token });
    //return ;
  });
}
});



app.get('/post/:id', function(req, res, next){
  var id = req.params.id;
  console.log(id);
  req.models.Post.find(id)
  .success(function(post) {
    if(post === null) {
      console.log(post);
      res.redirect(301, '/');
    } else {
     return res.render('post/post.twig', { url: req.url, csrf: res.locals.token, 'post': post });
   }
 });
});


app.get('/', function(req, res, next){
  req.models.Post.findAll().success(function(posts) {
    return res.render('homepage/index.twig', { url: req.url, csrf: res.locals.token, 'posts': posts });
  })
  .error(function(err) {
    res.json(406,{ error: err.message });
  })
  ;

});


app.all('*', function(req, res, next){
  res.redirect(301, '/');
  // res.render('homepage/index.twig', { url: req.url, csrf: res.locals.token });
  return;
});




app.listen(port);

console.log("Server listening on port: "+port);
