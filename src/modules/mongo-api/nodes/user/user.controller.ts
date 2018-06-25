import * as express from 'express';
import { UserModel } from './user.model';

/**
 * ODIN :: API Framwork
 * Copyright (c) CUREON, 2018
 *
 * class  : UserController
 * author : André Kirchner <andre.kirchner@cureon.de>
 */
export class UserController {
  /**
   * Constructor
   * @param config
   */
  constructor(private config: any) {}

  /**
   * Get users from database
   * @param req
   */
  public async getUser(req: express.Request) {
    const id = req.params.id;

    return id ? UserModel.findById(id) : UserModel.find({});
  }

  /**
   * Write users to database
   * @param req
   */
  setUser(req: express.Request) {
    const id   = req.params.id;
    const data = req.body;

    return id ? UserModel.create(data) : UserModel.findByIdAndUpdate(id, data);
  }

  /**
   * Delete users from database
   * @param req
   */
  deleteUser(req: express.Request) {
    const id = req.params.id;

    return UserModel.findByIdAndRemove(id);
  }
}
