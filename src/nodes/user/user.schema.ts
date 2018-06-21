import { Schema } from 'mongoose';

export const userSchema: Schema = new Schema({
  age: {
      type: Number
  },
  firstName: {
      type: String,
      required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  createdAt: {
      type: Date,
      'default': new Date()
  }
});

userSchema.pre('save', (next) => {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
});
