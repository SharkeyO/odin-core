import { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface IUserModel extends Model<IUser> {
  updateAuthor(id: {}, description: string): Promise<{ nModified: number }>
  updateByAge(ageLimit: number, text: string): Promise<{ ok: number, nModified: number, n: number }>
}
