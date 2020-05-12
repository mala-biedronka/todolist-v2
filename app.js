const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});


//Creating a schema and a model for a new item
const itemsSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item"
});

const item3 = new Item({
  name: "<-- Hit this to delete an item"
});

//An array of the default items in the todolist
const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {
  //Finding all the documents in the items collection
  Item.find(function (err, docs) {
    if (docs.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items in todolistDB!");
          res.redirect("/");
        }
      });
    } else {
      res.render("list", {listTitle: "Today", newListItems: docs});
    }
  });
});


//Create a post request
app.post("/", function(req, res){
  const itemName = req.body.newItem;

  const itemNew = new Item ({
    name: itemName
  });
  itemNew.save();

  res.redirect("/");
});


//A post request to delete route

app.post("/delete", function (req, res) {
  const checkedItem = req.body.checkbox;
  Item.findByIdAndRemove(checkedItem, function (err) {
    if (!err) {
      console.log("Successfully removed an item from todolistDB!");
      res.redirect("/");
    }
  });

});



app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
