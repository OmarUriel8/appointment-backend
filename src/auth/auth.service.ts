import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto, LoginUserDto } from './dto';
import { User } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';
import { JwtPayload } from './interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async create(registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto;

    const user = await this.userService.create({ name, email, password });

    if (user) {
      return {
        ...user,
        toke: this.getJwtToken({
          email: user.email,
          name: user.name,
          role: user.role,
        }),
      };
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    let user: User | null;
    try {
      user = await this.userService.findOneWithPassword(email);
    } catch (error) {
      console.log(error);
      user = null;
    }

    if (!user) {
      throw new UnauthorizedException('Credintials are not valid');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credintials are not valid');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive, talk with an admin');
    }

    delete (user as any).password;

    return {
      ...user,
      token: this.getJwtToken({
        email: user.email,
        name: user.name,
        role: user.role,
      }),
    };
  }

  checkAuthStatus(user: User) {
    const payload: JwtPayload = {
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      ...user,
      token: this.getJwtToken(payload),
    };
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }
}
