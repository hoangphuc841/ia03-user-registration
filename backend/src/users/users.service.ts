import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepo: Repository<User>,
	) {}

    async createUser(email: string, password: string): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hash_password = await bcrypt.hash(password, salt);
        const newUser = this.usersRepo.create({ email, hash_password });
        return await this.usersRepo.save(newUser);
    }

	async findOneByEmail(email: string): Promise<User | null> {
		return await this.usersRepo.findOneBy({ email });
	}

	async findOneByEmailForAuth(email: string): Promise<User | null> {
        return await this.usersRepo
            .createQueryBuilder('user')
            .addSelect('user.hash_password')
            .where('user.email = :email', { email })
            .getOne();
    }
}
