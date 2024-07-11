import { UserTypeDto } from "../dto/user.type.dto";
import { UserType } from "../model/user.type";


function mapUserTypeToUserTypeDto(userType: UserType): UserTypeDto {
    const userTypeDto = new UserTypeDto();
    userTypeDto.id = userType.id;
    userTypeDto.name = userType.type;
    return userTypeDto;
}

export { mapUserTypeToUserTypeDto };
