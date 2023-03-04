import { static as serverStatic, json, urlencoded } from 'express';
import path from 'path';
import CServer from './CServer';
import { errorHandler } from './middlewares';

class App {
    private server: CServer;

    constructor() {
        this.server = new CServer();
    }

    public start() {
        this.server.init((expressServer, databaseConn, port) => {
            expressServer.use(serverStatic(path.join(__dirname, 'public')));
            expressServer.use(serverStatic(path.join(__dirname, 'assets')));
            expressServer.use(json());
            expressServer.use(urlencoded({ extended: true }));
            expressServer.use(CServer.routes);
            expressServer.use(errorHandler);

            expressServer.listen(port, () => {
                CServer.logger.info(`HTTP Server listening on port ${port}`);
                databaseConn.connect();
            });

            expressServer.on('close', () => {
                CServer.logger.info('Server closed');
                databaseConn.disconnect();
            });
        });
    }
}

const app = new App();
app.start();
