import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { FastifyRequest } from 'fastify';
import { envVariables } from 'src/constants';

@Injectable()
export class Access implements CanActivate {
  async canActivate(context: ExecutionContext) {
    if (envVariables.getVariable('NODE_ENV') === 'development') return true;

    const req = context.switchToHttp().getRequest<FastifyRequest>();

    const file = await fs.readFile(path.join(process.cwd(), 'host-content/ips.json'), { encoding: 'utf8' });

    try {
      const allowedIps = JSON.parse(file);

      return allowedIps.includes(req.ip); 
    } catch (e) {
      return false;
    }
  }
}
