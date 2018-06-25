import * as mongoose from 'mongoose';

/**
 * ODIN :: API Framwork
 * Copyright (c) CUREON, 2018
 *
 * const     : UserSchema, UserModel
 * interface : IUserModel
 * author    : André Kirchner <andre.kirchner@cureon.de>
 */

/**
 * User Schema Definition
 */
export const UserSchema: mongoose.Schema = new mongoose.Schema({
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

/**
 * Schema Static Methods
 */
UserSchema.statics.get = function get(id: string, callback: Function) {
  return id ? this.find(id).exec(callback) : this.find().exec(callback);
}

/**
 * Model Interface
 */
export interface IUserModel extends mongoose.Model<any> {}

/**
 * Model Instance
 */
export const UserModel: IUserModel = <IUserModel>mongoose.model('User', UserSchema);
