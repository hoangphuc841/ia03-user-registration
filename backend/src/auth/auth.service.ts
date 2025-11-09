import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(email: string, pass: string): Promise<any> {
        const existingUser = await this.usersService.findOneByEmail(email);
        if (existingUser) {
        throw new UnauthorizedException('User already exists');
        }
        const newUser = await this.usersService.createUser(email, pass);
        const { hash_password, ...result } = newUser;
        return result;
    }

    async signIn(
        email: string, 
        pass: string
    ): Promise<{access_token: string}> {
        const user = await this.usersService.findOneByEmailForAuth(email);

        const isMatch = user ? await bcrypt.compare(pass, user.hash_password) : false;
        
        if (!isMatch) {
            // 👇 Change this line
            throw new UnauthorizedException('Invalid email or password');
        }
        
        const authenticatedUser = user!;
        const payload = { email: authenticatedUser.email, sub: authenticatedUser.id };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
