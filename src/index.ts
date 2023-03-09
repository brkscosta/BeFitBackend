import CServer from './CServer';

class App {
    private server: CServer;

    constructor() {
        this.server = new CServer();
    }

    public start() {
        this.server.init((expressServer, databaseConn, port, logger) => {
            expressServer.listen(port, () => {
                logger.info(`HTTP Server listening on port ${port}`);
                databaseConn.connect();
            });

            expressServer.on('close', () => {
                logger.info('Server closed');
                databaseConn.disconnect();
            });
        });
    }
}

const app = new App();
app.start();
