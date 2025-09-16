import { Injectable, Logger, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppLogger implements LoggerService {
  private readonly logger = new Logger();
  private readonly logFilePath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'logs',
    'errors.log',
  );

  log(message: string) {
    this.logger.log(message, { timestamp: true });
    this.writeToFile(`LOG: ${message}`);
  }

  error(message: string, trace?: string | null, opt?: { isShowLog?: boolean }) {
    if (opt?.isShowLog) {
      this.logger.error(message, trace);
    }
    this.writeToFile(`ERROR: ${message}\nTRACE: ${trace}`);
  }

  warn(message: string) {
    this.logger.warn(message, { timestamp: true });
    this.writeToFile(`WARN: ${message}`);
  }

  private writeToFile(content: string) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${content}\n`;
    fs.mkdirSync(path.dirname(this.logFilePath), { recursive: true });
    fs.appendFileSync(this.logFilePath, logEntry, 'utf8');
  }
}
