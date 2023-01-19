const mongoose= require('mongoose');
const Lead = require('./models/leads');


mongoose.connect('mongodb://127.0.0.1:27017/crm-app');

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected swaggity");
});



const l = new Lead ({
    name: 'shane bracken',
    phoneNumber:'6184025132',
    email: 'swag.com'
})

l.save().then(l => {
    console.log(l)
})
.catch(e =>{
    console.log(e)
})


const lo = new Lead ({
    name: 'lauren Marx',
    phoneNumber:'3143348004',
    email: 'arty.com'
})

l.save().then(l => {
    console.log(lo)
})
.catch(e =>{
    console.log(e)
})

