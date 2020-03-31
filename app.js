const express = require('express'); 
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session')
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');

const app = express(); 

//Map to global promise
mongoose.Promise = global.Promise

// Connect to Mongoose 
mongoose.connect('mongodb://localhost:27017/corona', { useNewUrlParser: true, useUnifiedTopology: true})
    .then((console.log('MongoDB connected...')))
    .catch(err => console.log(err))

// Load Idea Model `
require('./models/Persona');
const Persona = mongoose.model('persona')

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
})); 
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method override middleware
app.use(methodOverride('_method')); 

// Express session middleware
app.use(session({
    secret: 'secret', 
    resave: true,
    saveUninitialized: true
}))

app.use(flash());

// Global Variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next(); 
})

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

// Persona Index Page

app.get('/personas', (req, res) => {
    Persona.find({})
    .sort({date: 'desc'})
    .then(personas => {
        res.render('personas/index', {
            personas: personas
        });
    });
})

// Add Persona form 
app.get('/personas/add', (req, res) => {
    res.render('personas/add')
})

// Edit Persona form
app.get('/personas/edit/:id', (req, res) => {
    Persona.findOne({
        _id: req.params.id
    })
    .then(persona => {
        res.render('personas/edit', {
            persona: persona
        })
    })
})


// Process form 
app.post('/personas', (req, res) => {
    let errors = []; 
    
    if(!req.body.name) {
        errors.push({text: 'Please add a name'})
    }
    if(!req.body.description) {
        errors.push({text: 'Please add description'})
    }
    
    if(errors.length > 0) {
        res.render('personas/add', {
            errors: errors, 
            name: req.body.name, 
            description: req.body.description
        }) 
    } else {
        const newUser = {
            name: req.body.name, 
            description: req.body.description
        }
        new Persona(newUser)
        .save()
        .then(persona => {
            req.flash('success_msg', 'Persona was added')
            res.redirect('/personas')
        })
    }
})

// Edit a persona
app.put('/personas/:id', (req, res) => {
    Persona.findOne({
        _id: req.params.id
    })
    .then(persona => {
        persona.name = req.body.name;
        persona.description = req.body.description;
        
        persona.save()
        .then(persona => {
            req.flash('success_msg', 'Persona was ammended with new info')
            res.redirect('/personas');
        })
    })
})

// Delete a persona 
app.delete('/personas/:id', (req, res) => {
    Persona.deleteOne({_id: req.params.id})
    .then(() => {
        req.flash('success_msg', 'Persona disappears from the universe')
        res.redirect('/personas')
    })
})


const port = 4000; 

app.listen(port, () => {
    console.log(`Server started on ${port}`)
})