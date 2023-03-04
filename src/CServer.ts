import express, { Router } from 'express';
import 'express-async-errors';
import path from 'path';
import AuthController from './controllers/CAuthController';
import UserController from './controllers/CUserController';
import { authenticateToken, errorHandler } from './middlewares';
import CEmailService from './services/CEmailService';
import Database from './utils/CDataBaseConnection';
import CEnvironmentLoader, { IEnverionmentVariables } from './utils/CEnvironmentLoader';
import CEventEmitter from './utils/CEventEmitter';
import CLogger from './utils/CLogger';

class CServer {
    private port: number;
    private database: Database;
    static environmentLoader: IEnverionmentVariables;
    static logger: CLogger;
    static eventEmitter: CEventEmitter;
    static emailSrv: CEmailService;
    static routes = Router();

    constructor() {
        CServer.environmentLoader = new CEnvironmentLoader().get();
        this.port = CServer.environmentLoader.PORT;
        CServer.eventEmitter = new CEventEmitter();
        CServer.logger = new CLogger();
        CServer.emailSrv = new CEmailService(CServer.logger, CServer.environmentLoader);
        this.database = new Database(CServer.logger, CServer.environmentLoader);
    }

    public init(callback: (expressServer: express.Express, databaseConn: Database, port: number) => void): void {
        // UserController
        CServer.routes.get('/api/v1/users/userController', authenticateToken, UserController.toString);
        CServer.routes.get('/api/v1/users', UserController.getAllUsers);
        CServer.routes.post('/api/v1/users/addUser', UserController.addUser);
        CServer.routes.post('/api/v1/users/sendEmail', UserController.sendEmail);

        //AuthController
        CServer.routes.post('/api/v1/auth/authenticate', AuthController.authenticate);

        const app = express();
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(express.static(path.join(__dirname, 'assets')));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(CServer.routes);
        app.use(errorHandler);
        callback(app, this.database, this.port);
    }

    public static getLogger(): CLogger {
        return this.logger;
    }

    public static getEventEmitter(): CEventEmitter {
        return this.eventEmitter;
    }

    public static getEmailService(): CEmailService {
        return this.emailSrv;
    }
}

export default CServer;
