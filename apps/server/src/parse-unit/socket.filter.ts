import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ERROR_CODES, stringifyErrorCode } from 'src/utils/errorCodes';
import { ParseUnitEvents } from './constants';
import { getSocketError } from './utils';

@Catch(WsException)
export class SocketFilter implements ExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();

    const socketError = getSocketError(exception);

    switch (exception.message) {
      case stringifyErrorCode(ERROR_CODES.INVALID_TOKEN): {
        client.emit(ParseUnitEvents.error, socketError);
        client.disconnect(true);
        return;
      }

      case stringifyErrorCode(ERROR_CODES.EMPTY_PARSE_UNIT_LIST):
      default: {
        client.emit(ParseUnitEvents.error, socketError);
      }
    }
  }
}
