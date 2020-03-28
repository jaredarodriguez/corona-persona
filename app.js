const express = require('express'); 
const exphbs = require('express-handlebars');

const app = express(); 

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
})); 
app.set('view engine', 'handlebars');

const port = 4000; 

// Index Route 
app.get('/', (req, res) => {
    const title = 'Welcome'
    res.render('index', {
        title: title
    })
})

// About route 
app.get('/about', (req, res) => {
    res.render('about')
})

app.listen(port, () => {
    console.log(`Server started on ${port}`)
})