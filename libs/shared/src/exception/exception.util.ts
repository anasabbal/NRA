import { NotFoundException } from '@nestjs/common';
import { createExceptionPayload, ExceptionPayloadFactory } from './exception.payload.factory';



export function throwException(type: ExceptionPayloadFactory): void {
  const exceptionPayload = createExceptionPayload(type);
  throw new NotFoundException(exceptionPayload.message);
}
