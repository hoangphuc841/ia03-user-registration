import { 
    Body, 
    Controller, 
    Post, 
    Get,
    HttpCode, 
    HttpStatus,
    Request,
    UseGuards,
    ForbiddenException  
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwtService: JwtService, 
        private configService: ConfigService,
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() body: { email: string; password: string }) {
        return this.authService.signIn(body.email, body.password);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    register(@Body() registerDto: RegisterDto) { 
        return this.authService.register(registerDto.email, registerDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(@Request() req) {
        // req.user.sub is the userId from the AuthGuard
        return this.authService.logout(req.user.sub);
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    async refresh(@Body() body: { refreshToken: string }) {
        const { refreshToken } = body;
        if (!refreshToken) {
            throw new ForbiddenException('Refresh token missing');
        }

        try {
            // 1. Verify the refresh token
            const payload = await this.jwtService.verifyAsync(
                refreshToken,
                { secret: this.configService.get<string>('JWT_REFRESH_SECRET') }
            );

            // 2. Call service to get new tokens
            return this.authService.refreshToken(payload.sub, refreshToken);

        } catch (e) {
            throw new ForbiddenException('Invalid or expired refresh token');
        }
    }
}