import { describe, expect, it, spyOn, beforeEach, afterEach } from "bun:test";
import { Logger, logger } from "../src/core/logger";

describe("Logger", () => {
	let consoleSpy: any;

	beforeEach(() => {
		// Reset logger level to info before each test
		logger.level = "info";
	});

	afterEach(() => {
		if (consoleSpy) {
			consoleSpy.mockRestore();
		}
	});

	it("should be a singleton", () => {
		const instance1 = Logger.getInstance();
		const instance2 = Logger.getInstance();
		expect(instance1).toBe(instance2);
		expect(instance1).toBe(logger);
	});

	it("should set log level correctly", () => {
		logger.level = "debug";
		expect(logger.level).toBe("debug");
	});

	describe("Logging Methods", () => {
		it("should log info messages when level is info", () => {
			consoleSpy = spyOn(console, "info").mockImplementation(() => {});
			logger.info("test info message");
			expect(consoleSpy).toHaveBeenCalled();
			expect(consoleSpy.mock.calls[0][0]).toContain("INFO");
			expect(consoleSpy.mock.calls[0][0]).toContain("test info message");
		});

		it("should not log debug messages when level is info", () => {
			consoleSpy = spyOn(console, "debug").mockImplementation(() => {});
			logger.debug("test debug message");
			expect(consoleSpy).not.toHaveBeenCalled();
		});

		it("should log debug messages when level is debug", () => {
			logger.level = "debug";
			consoleSpy = spyOn(console, "debug").mockImplementation(() => {});
			logger.debug("test debug message");
			expect(consoleSpy).toHaveBeenCalled();
			expect(consoleSpy.mock.calls[0][0]).toContain("DEBUG");
			expect(consoleSpy.mock.calls[0][0]).toContain("test debug message");
		});

		it("should log warn messages when level is info", () => {
			consoleSpy = spyOn(console, "warn").mockImplementation(() => {});
			logger.warn("test warn message");
			expect(consoleSpy).toHaveBeenCalled();
			expect(consoleSpy.mock.calls[0][0]).toContain("WARN");
			expect(consoleSpy.mock.calls[0][0]).toContain("test warn message");
		});

		it("should log error messages when level is info", () => {
			consoleSpy = spyOn(console, "error").mockImplementation(() => {});
			logger.error("test error message");
			expect(consoleSpy).toHaveBeenCalled();
			expect(consoleSpy.mock.calls[0][0]).toContain("ERROR");
			expect(consoleSpy.mock.calls[0][0]).toContain("test error message");
		});
	});

	describe("Context and Data", () => {
		it("should include context in the log message", () => {
			consoleSpy = spyOn(console, "info").mockImplementation(() => {});
			logger.info("msg", { requestId: "123", className: "TestClass" });
			const logMessage = consoleSpy.mock.calls[0][0];
			expect(logMessage).toContain("requestId=123");
			expect(logMessage).toContain("className=TestClass");
		});

		it("should log additional data object", () => {
			consoleSpy = spyOn(console, "info").mockImplementation(() => {});
			const data = { foo: "bar" };
			logger.info("msg", undefined, data);

			// Second call should be the data stringified
			expect(consoleSpy).toHaveBeenCalledTimes(2);
			expect(consoleSpy.mock.calls[1][0]).toBe(JSON.stringify(data, null, 2));
		});

		it("should log error stack trace when an Error object is passed", () => {
			consoleSpy = spyOn(console, "error").mockImplementation(() => {});
			const testError = new Error("Something went wrong");
			logger.error("failed", undefined, testError);

			expect(consoleSpy).toHaveBeenCalledTimes(2);
			expect(consoleSpy.mock.calls[1][0]).toBe(testError.stack);
		});
	});
});
