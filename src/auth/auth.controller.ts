import { Body, Controller, Get, Logger, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthGuard } from './guards/auth.guards';
import { UserResponseInterface } from './types/userResponse.interface';
import { UserEntity } from './user.entity';
import { AuthService } from './auth.service';



@Controller('user')
export class AuthController {
	private logger = new Logger('AuthController')
	constructor(
		private readonly authService: AuthService,

	) { }

	@Post()
	@UsePipes(new ValidationPipe())
	async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {

		const user = await this.authService.createUser(createUserDto);
		this.logger.verbose(`User ${user.username} is created`)
		return this.authService.buildUserResponse(user);
	}

	@Post('/login')
	@UsePipes(new ValidationPipe())
	async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
		const user = await this.authService.login(loginUserDto);
		return this.authService.buildUserResponse(user);

	}

	// @Get('/find/')
	// @UseGuards(AuthGuard)
	// async findFiles(
	// 	@User() user: UserEntity,
	// 	@Query('filename') filename: string,
	// 	@Query('path') path: string,
	// 	@Query('ext') extension: string,
	// ) {

	// 	// return this.userService.findFiles(path, filename)
	// 	return await this.authService.findFiles(path, filename, extension);

	// 	// return this.userService.buildUserResponse(user)
	// }
}
