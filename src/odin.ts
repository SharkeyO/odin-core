// General
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

// Nodes
import { IUser, userSchema } from './nodes/user';

/**
 * @class OdinServer
 */
export class OdinServer {
  /**
   * Members
   */
  public app: express.Application;

  /**
   * Constructor
   */
  constructor() {
    // Initialize Express APP
    this.app = express();

    // Configuration
    this.config();
    this.api();
  }

  /**
   * Configure application
   */
  public config() {
    // Setup BodyParser
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    // 404 Catch
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        err.status = 404;
        next(err);
    });
  }

  /**
   * Start Server
   */
  start() {
    this.app.listen(3000, () => {
      console.log('[SERVER] Application running on port 3000');
    });
  }

  /**
   * Create REST API routes
   */
  public api() {
    //empty for now
  }
}

// StartUp
const odinServer: OdinServer = new OdinServer();
odinServer.start();
