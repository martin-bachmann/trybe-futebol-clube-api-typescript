import { compare } from 'bcryptjs';
import { generateToken } from '../utils/JWT';
import UnauthorizedError from '../errors/unauthorized-error';
import User from '../database/models/UserModel';

export default class LoginService {
  constructor(private model = User) { }

  login = async (email: string, password: string): Promise<string> => {
    const user = await this.model.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Incorrect email or password');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Incorrect email or password');
    }

    const { id } = user;
    const token = generateToken(id, email);
    return token;
  };

  validateLogin = async (email: string): Promise<string> => {
    const user = await this.model.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Token must be a valid token');
    }
    const { role } = user;
    return role;
  };
}
