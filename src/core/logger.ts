import { format } from "date-fns";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
	requestId?: string;
	className?: string;
	methodName?: string;
	[key: string]: unknown;
}

export class Logger {
	private static instance: Logger;
	private logLevel: LogLevel = "info";

	private constructor() {
		const envLevel = process.env.LOG_LEVEL as LogLevel;
		if (envLevel) {
			this.logLevel = envLevel;
		}
	}

	public static getInstance(withLevel?: LogLevel): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}
		if (withLevel) {
			Logger.instance.setLogLevel(withLevel);
		}
		return Logger.instance;
	}

	public setLogLevel(level: LogLevel) {
		this.logLevel = level;
	}

	private formatMessage(
		level: LogLevel,
		message: string,
		context?: LogContext,
	): string {
		const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");
		const contextStr = context
			? `[${Object.entries(context)
					.map(([k, v]) => `${k}=${v}`)
					.join(" ")}]`
			: "";
		const levelStr = level.toUpperCase().padEnd(5, " ");
		return `[${timestamp}] ${levelStr} ${contextStr} ${message}`;
	}

	private shouldLog(level: LogLevel): boolean {
		const levels: LogLevel[] = ["debug", "info", "warn", "error"];
		return levels.indexOf(level) >= levels.indexOf(this.logLevel);
	}

	public debug(message: string, context?: LogContext, data?: unknown) {
		if (this.shouldLog("debug")) {
			console.debug(this.formatMessage("debug", message, context));
			if (data) {
				console.debug(JSON.stringify(data, null, 2));
			}
		}
	}

	public info(message: string, context?: LogContext, data?: unknown) {
		if (this.shouldLog("info")) {
			console.info(this.formatMessage("info", message, context));
			if (data) {
				console.info(JSON.stringify(data, null, 2));
			}
		}
	}

	public warn(message: string, context?: LogContext, data?: unknown) {
		if (this.shouldLog("warn")) {
			console.warn(this.formatMessage("warn", message, context));
			if (data) {
				console.warn(JSON.stringify(data, null, 2));
			}
		}
	}

	public error(message: string, context?: LogContext, error?: unknown) {
		if (this.shouldLog("error")) {
			console.error(this.formatMessage("error", message, context));
			if (error) {
				if (error instanceof Error) {
					console.error(error.stack);
				} else {
					console.error(JSON.stringify(error, null, 2));
				}
			}
		}
	}
}

export const logger = Logger.getInstance();
