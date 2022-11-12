const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);


app.route("/articles")

  .get((req, res) => {
    Article.find({}, (err, foundArticles) => {
      !err ? res.send(foundArticles) : res.send(err);
    });
  }) //dont put semicolon here

  .post((req, res) => {
    const newArticles = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticles.save((err) => {
      !err ? res.send("Successfully Added") : res.send(err);
    });
  }) //dont put semicolon here

  .delete((req, res) => {
    Article.deleteMany((err) => {
      !err ? res.send("successfully DELETED ALL ARTICLES") : res.send(err);
    });
  }); //only put semicolon in the end or else you'll break the chain



app.route("/articles/:articleTitle")

.get((req, res) => { 
   
  Article.find({title: req.params.articleTitle}, (err, foundArticles) => {
    foundArticles.length === 0 ? res.send("No Articles was found") : res.send(foundArticles);
  });
  
})

.put((req, res) => {
  Article.replaceOne( //collectin.update is deprecated!!!
    {title: req.params.articleTitle}, 
    {title: req.body.title, content: req.body.content}, 
    (err) => { 
      !err ? res.send("Successfully REPLACED the article") : res.send(err); 
    }
  );
})

.patch((req, res) => {
  Article.updateOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content}, 
    (err) => { 
      !err ? res.send("Successfully UPDATED the article") : res.send(err); 
    }
  );
})

.delete((req, res) => {
  Article.deleteOne(
    {title: req.params.articleTitle},
    (err) => { 
      !err ? res.send("Successfully DELETED the article") : res.send(err); 
    }
  )
});


app.listen(3000,() => {
  console.log("Server started on port 3000");
});