import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import type { FastifyRequest } from 'fastify';
import { envVariables } from 'src/constants';
import { ERROR_CODES, stringifyErrorCode } from 'src/utils/errorCodes';
import { getAuthToken } from 'src/utils/getAuthToken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const type = context.getType();

    let token: string = null;
    let Exception = null;

    switch (type) {
      case 'http': {
        const request = context.switchToHttp().getRequest<FastifyRequest>();
        token = getAuthToken(request.headers);
        Exception = UnauthorizedException;
      }

      case 'ws': {
        const data = context.switchToWs().getData();
        token = data?.token;
        Exception = WsException;
      }

      default:
      // noop
    }

    try {
      await this.jwtService.verifyAsync(token, {
        secret: envVariables.getVariable('JWT_SECRET'),
      });
    } catch (e) {
      throw new Exception(stringifyErrorCode(ERROR_CODES.INVALID_TOKEN));
    }

    return true;
  }
}
