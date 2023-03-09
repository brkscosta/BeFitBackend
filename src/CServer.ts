import express, { Router } from 'express';
import 'express-async-errors';
import { createTransport, Transporter } from 'nodemailer';
import path from 'path';
import { CAuthController } from './controllers/CAuthController';
import { CUserController } from './controllers/CUserController';
<<<<<<< HEAD
import { authenticateToken, errorHandler } from './middlewares';
=======
import { authenticateToken, errorHandler } from './middlewares';
>>>>>>> 67bbbea (Added coverage support (lcov) removed some env variables  and test for CEmailService.ts)
import { CUserRepository, IUserRepository } from './repositories/CUserRepository';
import { CEmailService, IMailService } from './services/CEmailService';
import { CDatabaseConnection } from './utils/CDataBaseConnection';
import { CEnvironmentLoader, IEnverionmentVariables } from './utils/CEnvironmentLoader';
import { CEventEmitter } from './utils/CEventEmitter';
import { CLogger } from './utils/CLogger';

class CServer {
    private port: number;
    private database: CDatabaseConnection;
    private userRepository: IUserRepository;
    private emailSrv: IMailService;
    private userController: CUserController;
    private environmentLoader: IEnverionmentVariables;
    private logger: CLogger;
    private eventEmitter: CEventEmitter;
    private routes = Router();
    private transporter: Transporter;

    constructor() {
        this.environmentLoader = new CEnvironmentLoader().get();
        this.port = this.environmentLoader.PORT;
        this.eventEmitter = new CEventEmitter();
        this.logger = new CLogger(this.environmentLoader);

        this.transporter = createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            secure: true,
            auth: {
                user: this.environmentLoader.GMAIL_EMAIL,
                pass: this.environmentLoader.GMAIL_PASSWORD,
            },
        });
        this.emailSrv = new CEmailService(this.transporter);
        this.database = new CDatabaseConnection(this.logger, this.environmentLoader);

        this.userRepository = new CUserRepository();
        this.userController = new CUserController(this.userRepository, this.emailSrv);
    }

    public init(
        callback: (
            expressServer: express.Express,
            databaseConn: CDatabaseConnection,
            port: number,
            logger: CLogger
        ) => void
    ): void {
        const app = this.setupExpressApp();

        // UserController
        this.routes.get('/api/v1/users/ctrlName',authenticateToken, this.userController.toString);
        this.routes.get('/api/v1/users', this.userController.getAllUsers);
        this.routes.post('/api/v1/users/addUser', this.userController.addUser);
        this.routes.post('/api/v1/users/sendEmail', authenticateToken, this.userController.sendEmail);
        this.routes.post('/api/v1/users/:email', this.userController.find);
        this.routes.delete('/api/v1/users/removeUser/:email', this.userController.remove);

        //AuthController
        this.routes.post('/api/v1/auth/login', CAuthController.authenticate);

        callback(app, this.database, this.port, this.logger);
    }

    private setupExpressApp() {
        const app = express();
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(express.static(path.join(__dirname, 'assets')));
        app.use('/coverage', express.static(path.join(__dirname, '../coverage/lcov-report')));
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(this.routes);
        app.use(errorHandler);
        return app;
    }
}

export default CServer;
