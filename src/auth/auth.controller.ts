import { AuthLoginUsuarioDto } from './dtos/auth-login-usuario.dto';
import { AwsCognitoService } from './../aws/aws-cognito.service';
import { AuthRegistroUsuarioDto } from './dtos/auth-registro-usuario.dto';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private awsCognitoService: AwsCognitoService) {}

  @Post('/registro')
  @UsePipes(ValidationPipe)
  async registro(@Body() authRegistroUsuarioDto: AuthRegistroUsuarioDto) {
    return await this.awsCognitoService.autenticarUsuario(
      authRegistroUsuarioDto,
    );
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() authLoginUsuarioDto: AuthLoginUsuarioDto) {
    return await this.awsCognitoService.autenticarUsuario(authLoginUsuarioDto);
  }
}
