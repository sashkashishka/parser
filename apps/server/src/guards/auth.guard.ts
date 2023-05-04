import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt';
import type { FastifyRequest } from 'fastify';
import { envVariables } from 'src/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = this.getToken(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      await this.jwtService.verifyAsync(
        token,
        {
          secret: envVariables.getVariable('JWT_SECRET'),
        },
      );
    } catch (e) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private getToken(request: FastifyRequest) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Token' ? token : undefined;
  }
}
