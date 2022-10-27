import { Request, Response } from 'express';
import statusCodes from '../statusCodes';
import LoginService from '../services/LoginService';

export default class LoginController {
  constructor(private loginService = new LoginService()) { }

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await this.loginService.login(email, password);
    return res.status(statusCodes.ok).json({ token });
  };

  validateLogin = async (req: Request, res: Response) => {
    const { email } = req.body.user;
    const role = await this.loginService.validateLogin(email);
    return res.status(statusCodes.ok).json({ role });
  };
}
