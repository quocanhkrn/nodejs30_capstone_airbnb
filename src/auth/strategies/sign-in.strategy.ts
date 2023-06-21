import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SignInStrategy extends PassportStrategy(Strategy, 'sign-in') {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.validate(email, password);
      if (!user) {
        throw new UnauthorizedException();
      } else {
        const data = this.jwtService.sign({ data: user });
        return { message: 'Successfully signed in!', access_token: data };
      }
    } catch (err) {
      throw err || new InternalServerErrorException();
    }
  }
}
