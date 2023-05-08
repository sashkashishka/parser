import { UseFilters, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayInit,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { AuthSocketFilter } from './auth-socket.filter';
import { AuthGuard } from 'src/guards/auth.guard';
import { getAuthToken } from 'src/utils/getAuthToken';
import { envVariables } from 'src/constants';
import { ERROR_CODES, stringifyErrorCode } from 'src/utils/errorCodes';
import { ParseUnitEvents } from './constants';
import { InitEventResDto } from './dto/InitEvent.dto';
import { StartEventReqDto } from './dto/StartEvent.dto';
import { StopEventResDto } from './dto/StopEvent.dto';
import { ErrorEventResDto } from './dto/ErrorEvent.dto';
import { ParseService } from './parse.service';

@WebSocketGateway({ transports: ['websocket'] })
@UseFilters(AuthSocketFilter)
@UseGuards(AuthGuard)
export class ParseGateway
  implements OnGatewayInit, OnGatewayConnection
{
  constructor(
    private jwtService: JwtService,
    private parseService: ParseService,
  ) {}

  afterInit(socket: Socket) {
    this.parseService.addSocket(socket);
  }

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

  @SubscribeMessage(ParseUnitEvents.init)
  async handleInit(): Promise<InitEventResDto> {
    return {
      event: ParseUnitEvents.init,
      data: this.parseService.parseOptions,
    };
  }

  @SubscribeMessage(ParseUnitEvents.start)
  handeStart(@MessageBody() { payload }: StartEventReqDto) {
    return this.parseService.start(
      payload.parseUnits,
      new Date(payload.endTime),
    );
  }

  @SubscribeMessage(ParseUnitEvents.resubscribe)
  handleResubscribe() {
    if (this.parseService.status() !== 'active') return undefined;

    return this.parseService.start([], new Date());
  }

  @SubscribeMessage(ParseUnitEvents.stop)
  async handeStop(): Promise<StopEventResDto | ErrorEventResDto> {
    this.parseService.stop();

    return {
      event: ParseUnitEvents.stop,
      data: this.parseService.parseOptions,
    };
  }
}