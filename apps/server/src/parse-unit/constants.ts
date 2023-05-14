export enum ParseUnitEvents {
  config = 'config',
  status = 'status',
  start = 'start',
  resubscribe = 'resubscribe',
  stop = 'stop',
  complete = 'complete',
  error = 'error',
}

export enum ParseStatus {
  PARSING = 'parsing',
  IDLE = 'idle',
}
