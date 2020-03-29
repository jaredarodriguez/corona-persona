const express = require('express'); 
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express(); 

// Connect to Mongoose 
mongoose.connect('mongodb://localhost:27017/corona', { useNewUrlParser: true, useUnifiedTopology: true})
    .then((console.log('MongoDB connected...')))
    .catch(err => console.log(err))

// Load Idea Model 
require('./models/Persona');
const Persona = mongoose.model('persona')

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
})); 
app.set('view engine', 'handlebars');

const port = 4000; 

// Index Route 
app.get('/', (req, res) => {
    const title = 'Hello Quarantine Quilter'
    res.render('index', {
        title: title
    })
})

// About route 
app.get('/about', (req, res) => {
    res.render('about')
})

// Add Persona form 
app.get('/personas/add', (req, res) => {
    res.render('/personas/add')
})



app.listen(port, () => {
    console.log(`Server started on ${port}`)
})