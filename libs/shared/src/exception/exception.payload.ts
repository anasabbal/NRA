import { HttpStatus } from "@nestjs/common";

export class ExceptionPayload {
    code: number;
    status: HttpStatus;
    message: string;
    args?: any[];
    reference?: string;

    constructor(code: number, status: HttpStatus, message: string) {
        this.code = code;
        this.status = status;
        this.message = message;
    }
    setArgs(args: any[]): void {
        this.args = args;
    }
}