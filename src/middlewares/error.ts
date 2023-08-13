import httpStatus from "http-status";
import config from "../config/config";
import ApiError from "../utils/ApiError";
import { Request, Response, NextFunction } from "express";

// Send response on errors
const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    let { code, message } = err;
    res.locals.errorMessage = err.message;

    const response = {
        code: code,
        message,
        ...(config.env === "development" && { stack: err.stack }),
    };

    if (config.env === "development") {
        console.error(err);
    }

    res.status(code).send(response);
};

export { errorHandler };
