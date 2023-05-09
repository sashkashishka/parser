import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import type { FastifyRequest } from 'fastify';
import { Socket } from 'socket.io';
import { envVariables } from 'src/constants';
import { iJwtPayload } from 'src/types/jwtPayload';
import { ERROR_CODES, stringifyErrorCode } from 'src/utils/errorCodes';
import { getAuthToken } from 'src/utils/getAuthToken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const type = context.getType();

    let token: string = null;
    let Exception = null;
    let transport: FastifyRequest | Socket = null;

    switch (type) {
      case 'http': {
        transport = context.switchToHttp().getRequest<FastifyRequest>();
        token = getAuthToken(transport.headers);
        Exception = UnauthorizedException;
        break;
      }

      case 'ws': {
        transport = context.switchToWs().getClient();
        const data = context.switchToWs().getData();
        token = data?.token;
        Exception = WsException;
        break;
      }

      default:
      // noop
    }

    try {
      const payload = await this.jwtService.verifyAsync<iJwtPayload>(token, {
        secret: envVariables.getVariable('JWT_SECRET'),
      });

      transport['user'] = payload;
    } catch (e) {
      throw new Exception(stringifyErrorCode(ERROR_CODES.INVALID_TOKEN));
    }

    return true;
  }
}
