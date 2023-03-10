const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
require("dotenv").config();
const mongoose = require("mongoose");
const _ = require("lodash");
console.log(date.getDate());

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "ejs");

mongoose.set("strictQuery", false);
const password = process.env.PASS;

mongoose
  .connect(
    `mongodb+srv://Flash7:${password}@cluster0.sk1g6fg.mongodb.net/todolistDB`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;

const itemsSchema = new Schema({
  name: { type: String, required: true },
});

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist.",
});

const item2 = new Item({
  name: "Hit the + button to add a new item.",
});

const item3 = new Item({
  name: "<-- hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];

const listSchema = new Schema({
  name: String,
  items: [itemsSchema],
});

const List = mongoose.model("list", listSchema);

// Item.deleteMany({}, (err) => {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('Successfully deleted all the documents');
//   }
// });

// const items = ['Buy Food', 'Cook Food', 'Eat Food'];
// const workItem = [];

const day = date.getDate();

app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully inserted the documents");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newListItem: foundItems });
    }
  });

  // res.render('list', {listTitle: day, newListItem: items});

  // let currentDay = today.getDay();
  // let day = '';
  // switch(currentDay) {
  //   case 0:
  //     day = 'Sunday';
  //     break;
  //   case 1:
  //     day = 'Monday';
  //     break;
  //   case 2:
  //     day = 'Tuesday';
  //     break;
  //   case 3:
  //     day = 'Wednesday';
  //     break;
  //   case 4:
  //     day = 'Thursday';
  //     break;
  //   case 5:
  //     day = 'Friday';
  //     break;
  //   case 6:
  //     day = 'Saturday';
  //     break;
  //   default:
  //     console.log('Error: current day is equal to: ' + currentDay);
  // }
});

app.get("/:listTitle", (req, res) => {
  const listTitle = _.capitalize(req.params.listTitle);

  List.findOne({ name: listTitle }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        //Create a new list
        const list = new List({
          name: listTitle,
          items: defaultItems,
        });

        list.save();
        res.redirect(`/${listTitle}`);
      } else {
        //Show an existing list
        res.render("list", {
          listTitle: foundList.name,
          newListItem: foundList.items,
        });
      }
    }
  });
});

app.post("/", (req, res) => {
  console.log(req.body);

  const itemName = req.body.addItem;

  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName === day) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect(`/${listName}`);
    });
  }

  // const item = req.body.addItem;

  // if(req.body.list === "Work List") {
  //   workItem.push(item);
  //   res.redirect('/work');
  // } else {
  //   items.push(item);
  //   res.redirect('/');
  // }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkBox.trim(); // remove leading/trailing spaces
  const itemId = mongoose.Types.ObjectId(checkedItemId);
  console.log(itemId);
  // console.log(checkedItemId);

  const listName = req.body.listName;

  if (listName === day) {
    Item.findByIdAndRemove(itemId, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted the document");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: itemId } } },
      (err, foundList) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully deleted the item from the list");
          res.redirect(`/${listName}`);
        }
      }
    );
  }
});

// app.get('/work/:listTitle', (req, res) => {
//   const listTitle = req.params.listTitle;
// res.render('list', {listTitle: listTitle, newListItem: workItem});
// });

// app.get('/work', (req, res) => {
// res.render('list', {listTitle: 'Work List', newListItem: workItem});
// });

// app.post("/work", (req, res) => {
//   const item = req.body.addItem;
//   workItem.push(item);
//   res.redirect("/work");
// });

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
