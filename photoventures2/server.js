const express = require('express')
const path = require('path')
const app = express()

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static('public'));
app.get('/', function(req, res) {
    res.render('index');
});


app.listen(20603, () => console.log('Example app listening on port 3000!'))
