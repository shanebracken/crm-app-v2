const Joi = require('joi');

module.exports.leadSchema = Joi.object({
   
        name: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().required(),
        phonenumber: Joi.string().required(),
        status: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        zipcode: Joi.string().required(),
        address: Joi.string().required(),
        notes: Joi.string().required(),

});


