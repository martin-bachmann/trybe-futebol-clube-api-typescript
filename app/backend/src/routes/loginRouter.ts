import { Router } from 'express';
import loginMiddleware from '../middlewares/loginMiddleware';
import LoginController from '../controllers/LoginController';
import { validateJWT } from '../utils/JWT';

const router = Router();

const loginController = new LoginController();

router.post('/', loginMiddleware, loginController.login);

router.get('/validate', validateJWT, loginController.validateLogin);

export default router;
