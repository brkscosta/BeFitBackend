import express, { json, NextFunction, Request, Response, Router, static as serverStatic, urlencoded } from 'express';
import 'express-async-errors';
import path from 'path';
import AuthController from './controllers/AuthController';
import UserController from './controllers/UserController';
import { authenticateToken, errorHandler } from './middlewares/index';
import { IUserRepository, UserRepository } from './repositories/UserRepository';
import EmailService, { IEmailService } from './services/EmailService';
import DatabaseConnection, { IDatabaseConnection } from './utils/DataBaseConnection';
import EnvironmentLoader, { IEnverionmentVariables } from './utils/EnvironmentLoader';
import Logger, { ILogger } from './utils/Logger';

class Server {
    private port: number;
    private database: IDatabaseConnection;
    private environmentLoader: IEnverionmentVariables;
    private logger: ILogger;
    //private eventEmitter: IEventEmitter;
    private emailSrv: IEmailService;
    private expressServer: express.Express;
    private router = Router();
    private userRepo: IUserRepository;

    constructor() {
        this.expressServer = express();
        this.environmentLoader = new EnvironmentLoader().get();
        this.port = this.environmentLoader.PORT | 3000;
        //this.eventEmitter = new EventEmitter();
        this.logger = new Logger(this.environmentLoader);
        this.emailSrv = new EmailService(this.logger, this.environmentLoader);
        this.database = new DatabaseConnection(this.logger, this.environmentLoader);
        this.userRepo = new UserRepository();

        this.initExpress();
        this.initControllers();
    }

    private initExpress() {
        this.expressServer.use(serverStatic(path.join(__dirname, 'public')));
        this.expressServer.use(serverStatic(path.join(__dirname, 'assets')));
        this.expressServer.use(json());
        this.expressServer.use(urlencoded({ extended: true }));
        this.expressServer.use(this.router);
        this.expressServer.use((error: Error, req: Request, res: Response, next: NextFunction) => {
            return errorHandler(error, req, res, next, this.logger);
        });

        this.expressServer.listen(this.port, () => {
            this.logger.info(`HTTP Server listening on port ${this.port}`);
            this.database.connect();
        });

        this.expressServer.on('close', () => {
            this.logger.info('Server closed');
            this.database.disconnect();
        });
    }

    private initControllers() {
        const userCtrl = new UserController(this.logger, this.emailSrv, this.userRepo);
        const authCtrl = new AuthController(this.logger, this.emailSrv);

        this.router.get(
            '/api/v1/users/userController',
            (req: Request, res: Response, next: NextFunction) => {
                authenticateToken(req, res, next, this.logger);
            },
            userCtrl.toString
        );

        this.router.get('/api/v1/user/all', userCtrl.getAllUsers.bind(userCtrl));
        this.router.post('/api/v1/user/addUser', userCtrl.addUser.bind(userCtrl));
        this.router.post('/api/v1/user/sendEmail', userCtrl.sendEmail.bind(userCtrl));

        //AuthController
        this.router.post('/api/v1/auth/authenticate', authCtrl.authenticate.bind(authCtrl));
    }
}

export default Server;
