const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  let today = new Date();
  let currentDay = tooday.getDay();
  
  if(currentDay === 6 || currentDay === 0) {
    res.write('We need to work')
    res.write(`It's a weekend`);
    res.send();
  } else {
    res.send(`It's a weekday`);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});