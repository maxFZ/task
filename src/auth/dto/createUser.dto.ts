import { IsNotEmpty, IsEmail, MinLength } from 'class-validator'

export class CreateUserDto {
	@IsNotEmpty()
	@MinLength(3)
	readonly username: string;

	@IsNotEmpty()
	@IsEmail()
	readonly email: string;

	@IsNotEmpty()
	@MinLength(6)
	readonly password: string;

}