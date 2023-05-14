import { WsResponse } from "@nestjs/websockets";
import { ParseStatus, ParseUnitEvents } from "../constants";

export class StatusEventResDto implements WsResponse {
  event: ParseUnitEvents.status;
  data: ParseStatus;
}
