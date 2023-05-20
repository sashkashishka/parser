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
    // new transports.Console(),
    new transports.File({
      filename: './logs/parser.log',
    }),
  ],
});
