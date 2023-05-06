import { UseFilters, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthSocketFilter } from './auth.filter';
import { AuthGuard } from 'src/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { getAuthToken } from 'src/utils/getAuthToken';
import { envVariables } from 'src/constants';
import { ERROR_CODES, stringifyErrorCode } from 'src/utils/errorCodes';

@WebSocketGateway({ transports: ['websocket'] })
@UseFilters(AuthSocketFilter)
@UseGuards(AuthGuard)
export class ParseUnitGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private jwtService: JwtService) {}

  async handleConnection(socket: Socket) {
    const token = getAuthToken(socket.handshake.headers);

    try {
      await this.jwtService.verifyAsync(token, {
        secret: envVariables.getVariable('JWT_SECRET'),
      });
    } catch (e) {
      socket.send({
        event: 'error',
        data: stringifyErrorCode(ERROR_CODES.INVALID_TOKEN),
      });
      socket.disconnect(true);
    }
  }

  handleDisconnect(client: any) {}

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() payload: any): Promise<WsResponse<any>> {
    return {
      event: 'message',
      data: payload + Math.random(),
    };
  }
}
