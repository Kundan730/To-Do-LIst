const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
require('dotenv').config();

console.log(date.getDay());

const app = express();
const port = process.env.PORT || 3000;

const items = ['Buy Food', 'Cook Food', 'Eat Food'];
const workItem = [];

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {

  const day = date.getDate();

  res.render('list', {listTitle: day, newListItem: items});

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

app.post('/', (req, res) => {
  console.log(req.body);
  const item = req.body.addItem;
  if(req.body.list === "Work List") {
    workItem.push(item);
    res.redirect('/work');
  } else {
    items.push(item);
    res.redirect('/');
  }
});

app.get('/work', (req, res) => {
  res.render('list', {listTitle: 'Work List', newListItem: workItem});
});

app.post('/work', (req, res) => {
  const item = req.body.addItem;
  workItem.push(item);
  res.redirect('/work');
});

app.get('/about', (req, res) => {
  res.render('about');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});