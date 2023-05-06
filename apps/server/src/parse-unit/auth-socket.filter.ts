import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ParseUnitEvents } from './constants';

@Catch(WsException)
export class AuthSocketFilter implements ExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();

    client.send({ event: ParseUnitEvents.error, data: exception.message });
    client.disconnect(true);
  }
}
