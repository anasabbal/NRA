import { EmailConfirmation, EmailConfirmationSchema } from "../../models/email.confirmation";
import { User, UserSchema } from "../../models/user.schema";
import { UserType, UserTypeSchema } from "../../models/user.type";




export default [
    { name: User.name, schema: UserSchema },
    { name: UserType.name, schema: UserTypeSchema },
    { name: EmailConfirmation.name, schema: EmailConfirmationSchema}
];