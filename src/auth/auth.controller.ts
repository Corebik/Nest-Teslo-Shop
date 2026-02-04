import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Auth, RoleProtected } from './decorators';
import { GetUser } from './decorators/get-user.decorator';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  checkPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
  ) {
    return {
      ok: true,
      message: 'You have accessed a private route',
      user: user,
      userEmail: userEmail,
    };
  }

  // @SetMetadata('roles', ['admin', 'super-user']) //---> Alternative way without using custom decorator in line 42

  @Get('private2')
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  checkPrivateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      message: 'You have accessed a private route 2',
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.superUser)
  checkPrivateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      message: 'You have accessed a private route 3',
      user,
    };
  }
}
