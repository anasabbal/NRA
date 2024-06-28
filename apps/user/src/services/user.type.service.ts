import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserType } from "../model/user.type";
import { Repository } from "typeorm";
import { throwException } from "@app/shared/exception/exception.util";
import { ExceptionPayloadFactory } from "@app/shared/exception/exception.payload.factory";




@Injectable()
export class UserTypeService {

    private readonly logger = new Logger(UserTypeService.name);
    constructor(
        @InjectRepository(UserType)private readonly userTypeRepository: Repository<UserType>
    ){}

    async createUserType(type: string): Promise<UserType> {
        const userType = this.userTypeRepository.create({ type });
        return this.userTypeRepository.save(userType);
    }

    async seedUserTypes(): Promise<void> {
        try {
          const userTypes = ['Driver', 'User'];
    
          for (const type of userTypes) {
            await this.seedUserType(type);
          }
        } catch (error) {
          this.logger.error('Error seeding user types:', error);
        }
    }
    
    private async seedUserType(type: string): Promise<void> {
        try {
          const existingType = await this.userTypeRepository.findOne({where: {type}});
          if (!existingType) {
            const userType = await this.createUserType(type);
            this.logger.log(`User type '${type}' seeded successfully.`);
          } else {
            this.logger.debug(`User type '${type}' already exists.`);
          }
        } catch (error) {
          this.logger.error(`Error seeding user type '${type}': ${error.message}`);
        }
    }
    
    async findUserTypeById(id: string): Promise<UserType> {
        this.logger.log(`Begin fetching user type with id ${id}`);
        const userType = await this.userTypeRepository.findOne({ where: { id } });
    
        if (!userType) {
          this.logger.error(`UserType with id ${id} not found`);
          throwException(ExceptionPayloadFactory.USER_TYPE_NOT_FOUND);
        }
        this.logger.log(`User type fetched successfully with id ${id}`);
        return userType;
    }
    async getUserTypes(): Promise<UserType[]> {
      this.logger.log(`Begin fetching user types`);
      try {
        return await this.userTypeRepository.find();
      } catch (error) {
        this.logger.error('Error fetching all user types:', error.message);
        throw error;
      }
    }
}