import * as bcrypt from 'bcrypt';


export async function hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      this.logger.error(`Error hashing password: ${error.message}`);
      throw error;
    }
}