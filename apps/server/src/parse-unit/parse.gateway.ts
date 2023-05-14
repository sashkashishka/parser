import { UseFilters, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { SocketFilter } from './socket.filter';
import { AuthGuard } from 'src/guards/auth.guard';
import { getAuthToken } from 'src/utils/getAuthToken';
import { envVariables } from 'src/constants';
import { ERROR_CODES, stringifyErrorCode } from 'src/utils/errorCodes';
import { ParseUnitEvents } from './constants';
import { ConfigEventReqDto, ConfigEventResDto } from './dto/ConfigEvent.dto';
import { StopEventResDto } from './dto/StopEvent.dto';
import { ErrorEventResDto } from './dto/ErrorEvent.dto';
import { ParseService } from './parse.service';
import { StatusEventResDto } from './dto/StatusEvent.dto';
import { startWith } from 'rxjs';

@WebSocketGateway({ transports: ['websocket'] })
@UseFilters(SocketFilter)
@UseGuards(AuthGuard)
export class ParseGateway implements OnGatewayInit, OnGatewayConnection {
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

  @SubscribeMessage(ParseUnitEvents.status)
  handleStatus(): StatusEventResDto {
    return {
      event: ParseUnitEvents.status,
      data: this.parseService.status(),
    };
  }

  @SubscribeMessage(ParseUnitEvents.config)
  handleConfig(
    @MessageBody() { payload }: ConfigEventReqDto,
  ): ConfigEventResDto {
    this.parseService.setConfig(payload?.endTime);

    return {
      event: ParseUnitEvents.config,
      data: this.parseService.parseOptions,
    };
  }

  @SubscribeMessage(ParseUnitEvents.start)
  async handeStart(@ConnectedSocket() client: Socket) {
    const user = client.user;

    const stream$ = await this.parseService.start(user.id);

    return stream$.pipe(startWith({ event: ParseUnitEvents.start, data: {} }));
  }

  @SubscribeMessage(ParseUnitEvents.resubscribe)
  handleResubscribe() {
    return this.parseService.resubscribe();
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
