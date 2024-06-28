import { HttpStatus } from "@nestjs/common";
import { ExceptionPayload } from "./exception.payload";

enum ExceptionPayloadFactory {
    TECHNICAL_ERROR = 0,
    INVALID_PAYLOAD = 1,
    MISSING_REQUEST_BODY_ERROR_CODE = 2,
    EMAIL_ALREADY_EXIST = 3,
    USER_NAME_ALREADY_EXIST = 4,
    USER_NAME_NOT_FOUND = 5,
    CUSTOMER_NOT_FOUND = 6,
    DRIVER_NOT_FOUND = 7,
    DRIVER_LOCATION_NOT_FOUND = 8,
    USER_TYPE_NOT_FOUND = 9,
    
}

const exceptionPayloadDetails: { [key in ExceptionPayloadFactory]: { status: HttpStatus, message: string } } = {
    [ExceptionPayloadFactory.TECHNICAL_ERROR]: { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'technical.error' },
    [ExceptionPayloadFactory.INVALID_PAYLOAD]: { status: HttpStatus.BAD_REQUEST, message: 'invalid.request.payload' },
    [ExceptionPayloadFactory.MISSING_REQUEST_BODY_ERROR_CODE]: { status: HttpStatus.BAD_REQUEST, message: 'request.missing.body' },
    [ExceptionPayloadFactory.EMAIL_ALREADY_EXIST]: { status: HttpStatus.BAD_REQUEST, message: 'email.already.exist' },
    [ExceptionPayloadFactory.USER_NAME_ALREADY_EXIST]: { status: HttpStatus.BAD_REQUEST, message: 'username.already.exist' },
    [ExceptionPayloadFactory.USER_NAME_NOT_FOUND]: { status: HttpStatus.NOT_FOUND, message: 'username.not.found' },
    [ExceptionPayloadFactory.CUSTOMER_NOT_FOUND]: { status: HttpStatus.NOT_FOUND, message: 'customer.not.found' },
    [ExceptionPayloadFactory.DRIVER_NOT_FOUND]: { status: HttpStatus.NOT_FOUND, message: 'driver.not.found' },
    [ExceptionPayloadFactory.DRIVER_LOCATION_NOT_FOUND]: { status: HttpStatus.NOT_FOUND, message: 'driver.location.not.found' },
    [ExceptionPayloadFactory.USER_TYPE_NOT_FOUND]: { status: HttpStatus.NOT_FOUND, message: 'user.type.not.found' }
};

function createExceptionPayload(type: ExceptionPayloadFactory): ExceptionPayload {
    const details = exceptionPayloadDetails[type];
    return new ExceptionPayload(type, details.status, details.message);
}

export { ExceptionPayloadFactory, createExceptionPayload };