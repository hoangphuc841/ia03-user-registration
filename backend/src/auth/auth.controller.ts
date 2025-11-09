import { 
    Body, 
    Controller, 
    Post, 
    Get,
    HttpCode, 
    HttpStatus,
    Request,
    UseGuards 
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() body: { email: string; password: string }) {
        return this.authService.signIn(body.email, body.password);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    register(@Body() body: { email: string; password: string }) {
        return this.authService.register(body.email, body.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
