import { validate } from "class-validator";
import { UserCreateCommand } from "../commands/auth/user.create.cmd";
import { ExceptionPayloadFactory } from "../exception/exception.payload.factory";
import { throwException } from "../exception/exception.util";



export async function validateCommand(command: UserCreateCommand): Promise<void> {
    const errors = await validate(command);
    if (errors.length > 0) {
      this.logger.error(`Validation failed: ${JSON.stringify(errors)}`);
      throwException(ExceptionPayloadFactory.INVALID_PAYLOAD);
    }
  }