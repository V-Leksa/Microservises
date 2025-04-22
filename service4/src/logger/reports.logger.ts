import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info', // Уровень по умолчанию
  format: format.combine(
    format.timestamp(), // Временная метка
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`; // Формат вывода
    }),
  ),
  transports: [
    new transports.File({
      filename: 'error.log', // Логирование ошибок
      level: 'error', 
      handleExceptions: true,
    }),
    new transports.File({
      filename: 'info.log', // Логирование информации
      level: 'info', 
      handleExceptions: true,
    }),
    new transports.Console({ // Логирование в консоль
      level: 'debug', 
      handleExceptions: true,
      format: format.combine(
        format.colorize(),
        format.simple(),
      ),
    }),
  ],
});

// Обработка необработанных исключений
logger.exceptions.handle(
  new transports.File({ filename: 'exceptions.log', dirname: 'exceptions.log'})
);

export default logger;
