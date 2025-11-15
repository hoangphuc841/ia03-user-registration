import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    private async getTokens(user: User) {
        const payload = { email: user.email, sub: user.id };
        
        const [accessToken, refreshToken] = await Promise.all([
            // Access Token
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET') as string,
                expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION') as any,
            }),
            // Refresh Token
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET') as string,
                expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') as any,
            }),
        ]);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

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
    ): Promise<{access_token: string; refresh_token: string}> { // 👈 Update return type
        const user = await this.usersService.findOneByEmailForAuth(email);

        const isMatch = user ? await bcrypt.compare(pass, user.hash_password) : false;
        
        if (!isMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }
        
        const authenticatedUser = user!;
        
        // 1. Generate tokens
        const tokens = await this.getTokens(authenticatedUser);
        
        // 2. Save hashed refresh token to DB
        await this.usersService.updateRefreshToken(authenticatedUser.id, tokens.refresh_token);
        
        // 3. Return tokens
        return tokens;
    }

    async logout(userId: string): Promise<boolean> {
        // Set refresh token to null in DB
        await this.usersService.updateRefreshToken(userId, null);
        return true;
    }
    
    // --- REFRESH TOKEN (New Method) ---
    async refreshToken(
        userId: string, 
        refreshToken: string
    ): Promise<{access_token: string; refresh_token: string}> {
        
        // 1. Find user and their stored hash
        const user = await this.usersService.findOneById(userId);
        if (!user || !user.hashedRefreshToken) {
            throw new ForbiddenException('Access Denied');
        }

        // 2. Compare provided token with stored hash
        const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!isMatch) {
            throw new ForbiddenException('Access Denied');
        }

        // 3. (Token Rotation) Generate new tokens
        const tokens = await this.getTokens(user);

        // 4. (Token Rotation) Save new refresh token hash
        await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);

        // 5. Return new tokens
        return tokens;
    }
}
