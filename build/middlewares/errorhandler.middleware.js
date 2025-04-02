"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.success = false,
            this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, CustomError);
    }
}
exports.default = CustomError;
