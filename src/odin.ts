// Module Imports
import * as express from 'express';
import * as bodyParser from 'body-parser';

// Instantiate
const app = express();

// Config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * RUN APPLICATION
 * Function will run the server
 */
function run() {
    console.log('--- ODIN ---');
    console.log('[SERVER] Application started ...');

    // Open Server
    app.listen(3000, () => {
        console.log('[SERVER] Application running on port 3000');
    });
}

// Run Server
run();