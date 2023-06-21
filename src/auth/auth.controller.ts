import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  InternalServerErrorException,
  BadRequestException,
  UseInterceptors,
  Put,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from 'src/users/dto';
import { SignInGuard } from './guards/sign-in.guard';
import { UsersService } from 'src/users/users.service';
import { ApiBody, ApiConsumes, ApiTags, ApiHeader } from '@nestjs/swagger';
import { Request as Req } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangePasswordDTO } from '../users/dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(SignInGuard)
  @Post('sign-in')
  async signIn(@Body() user: SignInDTO, @Request() req: Req) {
    return req.user;
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: SignUpDTO,
  })
  @Post('sign-up')
  @UseInterceptors(FileInterceptor(null))
  async signUp(@Body() data: SignUpDTO) {
    try {
      const isExisted = await this.userService.checkExistence(data);
      if (isExisted) {
        throw new BadRequestException(
          'This email/phone number is already existed!',
        );
      } else {
        const user = await this.userService.create({
          ...data,
          role: 'Guest',
        });
        return { message: 'Sign up successfully!', data: user };
      }
    } catch (err) {
      throw err || new InternalServerErrorException();
    }
  }

  @UseGuards(LocalAuthGuard)
  @ApiHeader({ name: 'token', required: true })
  @ApiBody({ type: ChangePasswordDTO })
  @Put('change-password/:id')
  async changePassword(
    @Param('id') id: string,
    @Body() data: ChangePasswordDTO,
  ) {
    try {
      const { oldPassword, newPassword, confirmedNewPassword } = data;
      if (newPassword === confirmedNewPassword) {
        await this.userService.changePassword(
          +id,
          oldPassword,
          confirmedNewPassword,
        );
        return { message: 'Successfully changed the password!' };
      } else {
        throw new BadRequestException('Password does not match!');
      }
    } catch (err) {
      throw err || new InternalServerErrorException();
    }
  }
}
