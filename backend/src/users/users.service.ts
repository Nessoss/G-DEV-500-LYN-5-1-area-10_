import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.database.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find a user by ID
   */
  async findById(id: number): Promise<User | null> {
    return this.database.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new user
   */
  async create(data: {
    email: string;
    passwordHash: string;
  }): Promise<User> {
    return this.database.user.create({
      data,
    });
  }
}
