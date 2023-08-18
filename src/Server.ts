import express, { json, NextFunction, Request, Response, Router, static as serverStatic, urlencoded } from 'express';
import 'express-async-errors';
import { existsSync } from 'fs';
import { createTransport } from 'nodemailer';
import path from 'path';
import AuthController from './controllers/AuthController';
import UserController from './controllers/UserController';
import { authenticateToken, errorHandler } from './middlewares/index';
import { IUserRepository, UserRepository } from './repositories/UserRepository';
import EmailService, { IEmailService } from './services/EmailService';
import DatabaseConnection, { IDatabaseConnection } from './utils/DataBaseConnection';
import EnvironmentLoader, { IEnverionmentVariables } from './utils/EnvironmentLoader';
import Logger, { ILogger } from './utils/Logger';

const userApiURL = '/api/v1/user';
const authApiURL = '/api/v1/auth';

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
        const transporter = createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            secure: true,
            auth: {
                user: this.environmentLoader.GMAIL_EMAIL,
                pass: this.environmentLoader.GMAIL_PASSWORD,
            },
        });
        this.emailSrv = new EmailService(this.logger, this.environmentLoader, transporter);
        this.database = new DatabaseConnection(this.logger, this.environmentLoader);
        this.userRepo = new UserRepository();

        this.initExpress();
        this.initControllers();
    }

    private initExpress() {
        this.expressServer.use(serverStatic(path.join(__dirname, 'public')));
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
        this.router.get('/coverage', (req, res) => {
            const pathToFile = path.join(__dirname, '../build/coverage/lcov-report/index.html');

            if (!existsSync(pathToFile)) {
                return res.status(404).json({ message: 'The report coverage is not generated' });
            }
            
            this.expressServer.use(serverStatic(path.join(__dirname, '../build/coverage/lcov-report')));
            res.sendFile(pathToFile);
        });

        const userCtrl = new UserController(this.logger, this.emailSrv, this.userRepo);
        const authCtrl = new AuthController(this.logger, this.emailSrv);

        this.router.get(`${userApiURL}/userController`, (req: Request, res: Response, next: NextFunction) => {
            authenticateToken(req, res, next, this.logger);
        }, userCtrl.toString);

        this.router.get(`${userApiURL}/all`, userCtrl.getAllUsers.bind(userCtrl));
        this.router.post(`${userApiURL}/addUser`, userCtrl.addUser.bind(userCtrl));
        this.router.post(`${userApiURL}/sendEmail`, userCtrl.sendEmail.bind(userCtrl));

        this.router.post(`${authApiURL}/authenticate`, authCtrl.authenticate.bind(authCtrl));
    }
}

export default Server;
