const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const fs = require('fs');

const logDir = 'logs';
const {combine, timestamp, printf} = winston.format;

const logFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

/*
  https://velog.io/@ash/Node.js-%EC%84%9C%EB%B2%84%EC%97%90-logging-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-winston-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0
  Log Level: error(0), warn(1), info(2), http(3), verbose(4), debug(5), silly(6)
*/
const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat
  ),
  transports: [
    //info 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: '%DATE%.log',
      maxFiles: 14,
      zippedArchive: true
    }),
    //error 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`,
      filename: '%DATE%.error.log',
      maxFiles: 14,
      zippedArchive: true
    })
  ]
})

//Production 환경이 아닌 경우
if (process.env.NODE_ENV !== 'production'){
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }))
}

module.exports = {
  logger
}