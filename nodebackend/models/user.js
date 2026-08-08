// nodebackend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional because Google/GitHub logins won't have a password
  authProvider: { type: String, default: 'local' }, // 'local', 'google', or 'github'
}, { timestamps: true });

// Pre-save hook to hash the password before saving it to MongoDB
// Pre-save hook to hash the password before saving it to MongoDB
UserSchema.pre('save', async function() {
  // If the password hasn't been changed, just return and move on
  if (!this.isModified('password')) return;
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check password validity on login
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);