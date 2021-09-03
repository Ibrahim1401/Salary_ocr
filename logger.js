const {createLogger, transports, format} = require('winston');

const date = (new Date()).toISOString().split('T')[0];
let filename = 'api_logs';
filename = filename.concat(date, '.log');

const logger = createLogger({
  level: 'debug',
  format: format.combine(
      format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:sss'}),
      format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [
    new transports.File({
      filename: `./logs/${filename}`,
      json: false,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new transports.Console(),
  ],
});

module.exports = logger;
