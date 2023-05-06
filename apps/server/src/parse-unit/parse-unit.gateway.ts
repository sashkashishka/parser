import { UseFilters, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthSocketFilter } from './auth-socket.filter';
import { AuthGuard } from 'src/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { getAuthToken } from 'src/utils/getAuthToken';
import { envVariables } from 'src/constants';
import { ERROR_CODES, stringifyErrorCode } from 'src/utils/errorCodes';
import { ParseUnitEvents } from './constants';
import { InitEventReqDto, InitEventResDto } from './dto/InitEvent.dto';

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
        event: ParseUnitEvents.error,
        data: stringifyErrorCode(ERROR_CODES.INVALID_TOKEN),
      });
      socket.disconnect(true);
    }
  }

  handleDisconnect(client: any) {}

  @SubscribeMessage(ParseUnitEvents.init)
  async handleInit(@MessageBody() data: InitEventReqDto): Promise<InitEventResDto> {
    return {
      event: ParseUnitEvents.init,
      data,
    };
  }
}
