import { format, transports, createLogger } from 'winston';

const { combine, label, timestamp, printf } = format;

const formatter = printf(
  ({ timestamp, label, level, message }) =>
    `${timestamp} [${label}] ${level}: ${message}`,
);

export const parserLogger = createLogger({
  level: 'info',
  format: combine(label({ label: 'parser' }), timestamp(), formatter),
  transports: [
    new transports.File({
      filename: './host-content/logs/parser.log',
    }),
  ],
});
