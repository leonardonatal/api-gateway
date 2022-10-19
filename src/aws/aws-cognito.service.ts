import { AuthLoginUsuarioDto } from './../auth/dtos/auth-login-usuario.dto';
import { AwsCognitoConfig } from './aws-cognito.config';
import { AuthRegistroUsuarioDto } from './../auth/dtos/auth-registro-usuario.dto';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;

  constructor(private awsCognitoConfig: AwsCognitoConfig) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.awsCognitoConfig.userPoolId,
      ClientId: this.awsCognitoConfig.clientId,
    });
  }

  async registrarUsuario(authRegiustroUsuario: AuthRegistroUsuarioDto) {
    const { nome, email, senha, telefoneCelular } = authRegiustroUsuario;

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        senha,
        [
          new CognitoUserAttribute({
            Name: 'phone_number',
            Value: telefoneCelular,
          }),
          new CognitoUserAttribute({
            Name: 'name',
            Value: nome,
          }),
        ],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  async autenticarUsuario(authLoginUsuarioDto: AuthLoginUsuarioDto) {
    const { email, senha } = authLoginUsuarioDto;
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: senha,
    });
    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
