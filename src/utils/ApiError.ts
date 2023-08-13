class ApiError extends Error {
    code: number;

    constructor(code: number, message: string, stack?: string) {
        super(message);
        this.code = code;

        if (stack) {
            this.stack = stack;
        }
    }
}

export default ApiError;