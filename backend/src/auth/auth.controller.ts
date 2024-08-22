import { CreateUsuarioValidatioPipe } from '@/schema/auth-create-user';
import { LoginUserValidationPipe } from '@/schema/auth-login-user';
import { ResetPasswordValidationPipe } from '@/schema/auth-reset-password';
import { Body, Controller, HttpCode, Patch, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/user-create.dto';
import { UserForgotPasswordDto } from './dto/user-forgot-password.dto';
import { LoginUserDto } from './dto/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('create')
  @HttpCode(201)
  @UsePipes(CreateUsuarioValidatioPipe)
  async createUser(@Body() body: CreateUserDto) {

    const user = await this.authService.createUser(body);
    return user;
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(LoginUserValidationPipe)
  async loginUser(@Body() body: LoginUserDto) {

    const user = await this.authService.login(body);
    return user;
  }


  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() body: UserForgotPasswordDto) {

    const user = await this.authService.forgotPassword(body);
    return user;
  }


  @Patch('reset-password')
  @HttpCode(200)
  async resetPassword(
    @Body('token') token: string,
    @Body('senha', ResetPasswordValidationPipe) senha: string
  ) {

    const user = await this.authService.reset(senha, token);
    return user
  }
}
