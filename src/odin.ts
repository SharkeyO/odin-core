import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helpers from './system/helpers';
import * as fs from 'fs';

/**
 * @class OdinServer
 */
export class OdinServer {
  /**
   * Constants
   */
  readonly SYSTEM_PATH: string = __dirname + '/system';
  readonly PLUGIN_PATH: string = __dirname + '/modules';

  /**
   * Members
   */
  private config : any;
  public  app    : express.Application;

  /**
   * Constructor
   */
  constructor() {
    // Initialize Express APP
    this.app = express();
  }

  /**
   * Load config file
   */
  private loadConfigFile() {
    const filePath = this.SYSTEM_PATH + '/system.config.json';

    if (fs.existsSync(filePath)) {
      this.config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  }

  /**
   * Configure application
   */
  private async basicConfiguration() {
    // Setup BodyParser
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    // CORS Handler
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      next();
    });

    // 404 Catch
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      err.status = 404;
      next(err);
    });

    // Load Modules
    if (this.config.PLUGIN_ORDER && this.config.PLUGIN_ORDER.length) {
      await helpers.asyncForEach(this.config.PLUGIN_ORDER, async (pluginName: string) => {
        await this.pluginLoader(pluginName);
      });
    } else {
      // NO PLUGIN ERROR HANDLING
    }
  }

  /**
   * Function will load a plugin by given plugin name
   * @param pluginName
   */
  private async pluginLoader(pluginName: string) {
    const pluginPath = this.PLUGIN_PATH + '/' + pluginName + '/' + pluginName + '.plugin.ts';

    if (fs.existsSync(pluginPath)) {
      const pluginImport   = await import(pluginPath);
      const controllerName = Object.keys(pluginImport)[0];

      // Instantiate Plugin &
      const instPlugin = new pluginImport[controllerName](this.app);
      if(instPlugin.compile && typeof instPlugin.compile === 'function') {
        await instPlugin.compile();
      }
    }
  }

  /**
   * Start Server
   */
  public async start() {
    // Load config
    console.log('[SERVER] Loading configuration ...');
    this.loadConfigFile();

    // Setting up application
    console.log('[SERVER] Setting up application ...');
    await this.basicConfiguration();

    // Register Fallback/Closing Route
    console.log('[SERVER] Finalizing ...');
    this.app.all('*', (req, res, next) => {
      res.end();
    });

    // Start Server
    this.app.listen(3000, () => {
      console.log('[SERVER] ODIN running on port 3000');
    });
  }
}

// StartUp
const odinServer: OdinServer = new OdinServer();
odinServer.start();
