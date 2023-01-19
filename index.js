const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');

const port = 3000
const { leadSchema } = require('./schemas.js');
const Lead = require('./models/leads');

const status= ['Contacted', 'Not contacted']
const states= ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
let today = new Date().toLocaleDateString();

mongoose.connect('mongodb://127.0.0.1:27017/crm-app');

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected ");
});


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, '/public')))

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))



const validateLead = (req, res, next) => {
  const { error } = leadSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}



app.get('/leads', catchAsync(async (req, res) => {
  const leads = await Lead.find({})
  const title ='Leads'
  console.log(req.params)
  res.render('leads/index', { leads, title })

}))

app.get('/leads/new', (req, res) => {
  const title = 'Create new lead'
  res.render('leads/new', {title, status, states})
})

app.get('/leads/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const lead = await Lead.findById(id)
  const title = `${lead.name} ${lead.lastName}`
  res.render('leads/show', { lead, title, status, states })
}))

app.get('/leads/:id/edit',catchAsync (async (req, res) => {
  const { id } = req.params;
  const lead = await Lead.findById(id)
  const title = `Edit ${lead.name} ${lead.lastName}`
  res.render('leads/edit', { lead, title, status, states })
}))

app.put('/leads/:id', validateLead, catchAsync(async (req, res) => {
  const {id} = req.params;
  req.body.lastUpdated = `${today}`;
  const lead= await Lead.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
  console.log(req.body);
  res.redirect(`/leads/${lead._id}`)
}))

app.post('/leads', validateLead, catchAsync(async (req, res) => {
  // adds time stamp to the request body object
  req.body.created = `${today}`;
  const newLead = new Lead(req.body);
  await newLead.save();
  console.log(req.body)
  res.redirect(`/leads/${newLead._id}`)
}))

app.delete('/leads/:id', catchAsync(async (req, res) => {
  const {id} = req.params;
  const deletedLead = await Lead.findByIdAndDelete(id);
  res.redirect('/leads');
}))




app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})



app.listen(3000, () => {
  console.log(`Example app listening on port ${port}`)
})
