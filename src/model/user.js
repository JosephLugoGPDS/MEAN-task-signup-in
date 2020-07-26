const {Schema, model} =require('mongoose');

const userSchema = new Schema({
    email: String,
    password: String
},{
    //agregamos y automaticamente nos arroja la feche de creat and update
    timestamps: true
});

module.exports = model('User', userSchema);