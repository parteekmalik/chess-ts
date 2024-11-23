type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMessage {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  context?: string;
}

export class Logger {
  private static instance: Logger;
  
  private isDevelopment: boolean;

  private colors = {
    debug: '\x1b[36m', // Cyan
    info: '\x1b[32m',  // Green
    warn: '\x1b[33m',  // Yellow
    error: '\x1b[31m', // Red
    reset: '\x1b[0m',  // Reset
    dim: '\x1b[2m',    // Dim for timestamp
    bright: '\x1b[1m', // Bright for context
  };

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown, context?: string): LogMessage {
    return {
      level,
      message,
      data: data || undefined,
      timestamp: new Date().toISOString(),
      context,
    };
  }

  private log(logMessage: LogMessage): void {
    const { level, message, data, timestamp, context } = logMessage;
    
    if (this.isDevelopment) {
      const logFn = console[level] || console.log;
      const coloredTimestamp = `${this.colors.dim}${timestamp}${this.colors.reset}`;
      const coloredLevel = `${this.colors[level]}${level.toUpperCase()}${this.colors.reset}`;
      const coloredContext = context ? `${this.colors.bright}[${context}]${this.colors.reset} ` : '';
      const coloredMessage = `${this.colors[level]}${message}${this.colors.reset}`;
      
      logFn(`${coloredTimestamp} ${coloredLevel} ${coloredContext}${coloredMessage}`, data || '');
    } else {
      // In production, you might want to use a proper logging service
      // Example: winston, pino, or any cloud logging service
      console[level](JSON.stringify(logMessage));
    }
  }

  public debug(message: string, data?: unknown, context?: string): void {
    this.log(this.formatMessage('debug', message, data, context));
  }

  public info(message: string, data?: unknown, context?: string): void {
    this.log(this.formatMessage('info', message, data, context));
  }

  public warn(message: string, data?: unknown, context?: string): void {
    this.log(this.formatMessage('warn', message, data, context));
  }

  public error(message: string, data?: unknown, context?: string): void {
    this.log(this.formatMessage('error', message, data, context));
  }
}