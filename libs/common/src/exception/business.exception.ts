import { ExceptionPayload } from "./exception.payload";

export class BusinessException extends Error {
    private payload: ExceptionPayload;

    constructor(payload: ExceptionPayload, ...args: any[]) {
        super(payload.message);
        this.payload = payload;
        if (args.length) {
            this.payload.setArgs(args);
        }
    }

    getPayload(): ExceptionPayload {
        return this.payload;
    }
}
