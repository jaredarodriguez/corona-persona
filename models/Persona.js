const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

// Create Schema 
const PersonaSchema = new Schema({
    name:{
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    }, 
    date: {
        type: Date,
        default: Date.now()
    }
});

mongoose.model('persona', PersonaSchema);
