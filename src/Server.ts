import express, { Router } from 'express';
import 'express-async-errors';
import loadEnvVariables from './app/config';
import AuthController from './app/controllers/AuthController';
import UserController from './app/controllers/UserController';
import Database from './app/database';
import { authenticateToken, errorHandler } from './app/middlewares';
import EventEmitter from './app/utils/EventEmitter';
import Logger from './app/utils/Logger';

class Server {
    private port: number;
    static logger: Logger;
    static eventEmitter: EventEmitter;
    database: Database;
    static routes = Router();

    constructor() {
        this.port = process.env.PORT;
        Server.eventEmitter = new EventEmitter();
        Server.logger = new Logger();
        this.database = new Database();
        loadEnvVariables;
    }

    public start(): void {
        //UserController
        Server.routes.get(
            '/api/v1/users/userController',
            authenticateToken,
            UserController.toString
        );
        Server.routes.get('/api/v1/users/allUserNames', UserController.getAllUsers);
        Server.routes.post('/api/v1/users/addUser', UserController.addUser);
        Server.routes.post('/api/v1/users/sendEmail', UserController.sendEmail);

        //AuthController
        Server.routes.post('/api/v1/auth/authenticate', AuthController.authenticate);

        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(Server.routes);
        app.use(errorHandler);

        const server = app.listen(this.port, () => {
            Server.logger.info(`Server listening on port ${this.port}`);
            this.database.connect();
        });

        server.on('close', () => {
            Server.logger.info('Server closed');
            this.database.disconnect();
        });
    }

    public static getLogger(): Logger {
        return this.logger;
    }

    public static getEventEmitter(): EventEmitter {
        return this.eventEmitter;
    }
}

export default Server;
