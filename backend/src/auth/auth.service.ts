import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 12;

  constructor(private readonly usersService: UsersService) {}

  /**
   * Register a new user
   * @param registerDto - User registration data
   * @returns Created user (without password hash)
   */
  async register(registerDto: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
    const { email, password } = registerDto;

    this.logger.log(`Attempting to register user with email: ${email}`);

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      this.logger.warn(`Registration failed: User with email ${email} already exists`);
      throw new ConflictException('User with this email already exists');
    }

    try {
      const passwordHash = await this.hashPassword(password);
      const user = await this.usersService.create({
        email,
        passwordHash,
      });

      this.logger.log(`User successfully registered with ID: ${user.id}`);

      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      this.logger.error(`Registration failed for email ${email}:`, error);
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  /**
   * Hash a password using bcrypt
   * @param password - Plain text password
   * @returns Hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      this.logger.error('Failed to hash password:', error);
      throw new InternalServerErrorException('Failed to process password');
    }
  }

  /**
   * Verify a password against its hash
   * @param password - Plain text password
   * @param hash - Hashed password
   * @returns Boolean indicating if password is valid
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      this.logger.error('Failed to verify password:', error);
      return false;
    }
  }
}
