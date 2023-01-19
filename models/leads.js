const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leadSchema = new Schema ({
    name:String,
    lastName:String,
    email:String,
    phonenumber:String,
    status:String,
    state:String,
    city:String,
    zipcode:String,
    address:String,
    notes: String,
    created: String,
    lastUpdated: String,
    });


const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
