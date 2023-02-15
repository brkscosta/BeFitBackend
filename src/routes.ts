import { Router } from 'express';
import UserController from './app/controllers/UserController';

const routes = Router();

//UserController
routes.get('/userController', UserController.toString);
routes.get('/allUserNames', UserController.getAllUsers);
routes.post('/addUser', UserController.addUser);
routes.post('/sendEmail', UserController.sendEmail);

export default routes;
