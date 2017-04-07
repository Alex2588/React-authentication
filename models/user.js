const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
});

// On save hook, encrypt password
userSchema.pre('save', function(next){
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    
    bcrypt.hash(user.password, salt, null, (error, hash) => {
      if (error) return next(error);
      
      user.password = hash;
      next();
    });
  });
});

const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;