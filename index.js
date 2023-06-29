const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync('./products.json'));
  res.render('index', { data });
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', (req, res) => {
  const data = JSON.parse(fs.readFileSync('./products.json'));
  const id = data.length > 0 ? data[data.length - 1].id + 1 : 1;
  const newProduct = { id, ...req.body };
  data.push(newProduct);
  fs.writeFileSync('./products.json', JSON.stringify(data));
  res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync('./products.json'));
  const product = data.find(p => p.id === parseInt(req.params.id));
  res.render('edit', { product });
});

app.post('/edit/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync('./products.json'));
  const productIndex = data.findIndex(p => p.id === parseInt(req.params.id));
  data[productIndex] = { id: parseInt(req.params.id), ...req.body };
  fs.writeFileSync('./products.json', JSON.stringify(data));
  res.redirect('/');
});

app.get('/delete/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync('./products.json'));
  const filteredData = data.filter(p => p.id !== parseInt(req.params.id));
  fs.writeFileSync('./products.json', JSON.stringify(filteredData));
  res.redirect('/');
});



app.listen(3000, () => {
  console.log('Server started on port 3000');
});
