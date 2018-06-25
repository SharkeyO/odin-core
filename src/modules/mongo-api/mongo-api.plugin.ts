import * as express from 'express';
import * as helpers from '../../system/helpers';
import * as mongoose from 'mongoose';
import * as fs from 'fs';

/**
 * ODIN :: API Framwork
 * Copyright (c) CUREON, 2018
 *
 * class  : CoreModule
 * author : André Kirchner <andre.kirchner@cureon.de>
 */
export class MongoApiModule {
  /**
   * Members
   */
  private nodes     : any    = {};
  private NODE_PATH : string = __dirname + '/nodes';

  /**
   * Constructor
   */
  constructor(private ctx: express.Application) {}

  /**
   * Plugin Initialization
   */
  private async initPlugin() {
    // Mongo Connection
    mongoose.connect('mongodb://127.0.0.1:33001/test')
  }

  /**
   * Function will generate routes from given nodes
   */
  private async registerNodes() {
    const arrNodes: string[] = fs.readdirSync(this.NODE_PATH);

    if (arrNodes.length) {
      await helpers.asyncForEach(arrNodes, async (nodeName: any) => {
        // Prerequisites
        this.nodes[nodeName] = {};
        let nodeConfig;

        // Load Config
        const configFile = this.NODE_PATH + '/' + nodeName + '/' + nodeName + '.config.json';

        if (fs.existsSync(configFile)) {
          nodeConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
          this.nodes[nodeName].config = nodeConfig;
        }

        // Load Controllers
        const constrollerPath = this.NODE_PATH + '/' + nodeName + '/' + nodeName + '.controller.ts';
        if (fs.existsSync(constrollerPath) && nodeConfig) {
          const moduleImport   = await import(constrollerPath);
          const controllerName = Object.keys(moduleImport)[0];

          // Instantiate Controller
          const iCtrl = new moduleImport[controllerName](nodeConfig);
          this.nodes[nodeName].controller = iCtrl;
        }
      });
    }
  }

  /**
   * Function will perform request against loaded controller
   * and handle server response based on methods promised response
   * @param method
   * @param req
   * @param res
   * @param next
   */
  private forwardRequest(method: Function, req: express.Request, res: express.Response, next: express.NextFunction) {
    method(req).then((data: any) => {
      res.write(JSON.stringify(data));
      next();
    }).catch((err: any, ) => {
      res.write(JSON.stringify(null));
      next();
    });
  }

  /**
   * Create REST API routes
   */
  private generateApi() {
    Object.keys(this.nodes).forEach((nodeName) => {
      const config     = this.nodes[nodeName].config;
      const controller = this.nodes[nodeName].controller;

      if (config && config.ROUTES && controller) {
        Object.keys(config.ROUTES).forEach((routeName) => {
          const objRoute     = config.ROUTES[routeName];
          const methodGET    = controller[objRoute.GET];
          const methodPOST   = controller[objRoute.POST];
          const methodPUT    = controller[objRoute.PUT];
          const methodDELETE = controller[objRoute.DELETE];

          // GET
          if (methodGET && typeof methodGET === 'function') {
            this.ctx.get(routeName, (req: express.Request, res: express.Response, next: express.NextFunction) => {
              this.forwardRequest(methodGET, req, res, next);
            });
          }

          // POST
          if (methodPOST && typeof methodPOST === 'function') {
            this.ctx.post(routeName, (req: express.Request, res: express.Response, next: express.NextFunction) => {
              this.forwardRequest(methodGET, req, res, next);
            });
          }

          // PUT
          if (methodPUT && typeof methodPUT === 'function') {
            this.ctx.put(routeName, (req: express.Request, res: express.Response, next: express.NextFunction) => {
              this.forwardRequest(methodGET, req, res, next);
            });
          }

          // DELETE
          if (methodDELETE && typeof methodDELETE === 'function') {
            this.ctx.delete(routeName, (req: express.Request, res: express.Response, next: express.NextFunction) => {
              this.forwardRequest(methodGET, req, res, next);
            });
          }
        });
      }
    });
  }

  /**
   * Compile
   */
  public async compile() {
    await this.initPlugin();
    await this.registerNodes();
    this.generateApi();
  }
}
