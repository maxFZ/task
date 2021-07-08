import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken'
import { JWT_SECRET } from 'src/config';
import { UserResponseInterface } from './types/userResponse.interface';
import { UserType } from './types/user.type';
import { LoginUserDto } from './dto/loginUser.dto';
import { compare } from 'bcrypt'
import * as readdirp from 'readdirp';

import * as fs from 'fs'
import * as Path from 'path'


@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>) { }

	async createUser(createUserDto: CreateUserDto) {
		const userByEmail = await this.userRepository.findOne({
			email: createUserDto.email
		});

		const userByUsername = await this.userRepository.findOne({
			username: createUserDto.username
		});

		if (userByEmail || userByUsername) {
			throw new HttpException('Email or username are taken', HttpStatus.UNPROCESSABLE_ENTITY);
		}

		const newUser = new UserEntity();
		Object.assign(newUser, createUserDto);
		return await this.userRepository.save(newUser)
	}

	async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
		const user = await this.userRepository.findOne({
			email: loginUserDto.email
		}, { select: ['id', 'username', 'email', 'password'] });

		if (!user) {
			throw new HttpException('Credentailas are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
		}

		const isPasswordCorrect = await compare(loginUserDto.password, user.password)


		if (!isPasswordCorrect) {
			throw new HttpException('Credentailas are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
		}

		delete user.password;
		return user;
	}

	findById(id: number): Promise<UserEntity> {
		return this.userRepository.findOne(id);
	}

	// async findFiles(path, filename) {
	// 	// let files = fs.readdirSync(path);
	// 	// console.log(files)











	// 	// let searchResult = files.filter(file => file.match(new RegExp(`(${filename}).*\.`, 'ig')));
	// 	// let result = { files: searchResult }
	// 	// fs.writeFile(`search/search-${filename}.json`, JSON.stringify(result, null, 4), (err) => {
	// 	// 	if (err) { console.error(err); return; };
	// 	// 	console.log("File has been created");
	// 	// });
	// 	// return result;
	// }


	// async checkfile(files, filepath) {
	// 	const result = [];
	// 	for (let i = 0; i < files.length; i++) {
	// 		let newpath = Path.join(filepath, files[i]);
	// 		const stats = await fs.promises.stat(newpath);
	// 		if (stats.isDirectory()) {
	// 			const files = await fs.promises.readdir(newpath);
	// 			result.push(files);
	// 		} else result.push(files[i]);
	// 	}
	// 	return result;
	// }

	// async test(filepath) {
	// 	const files = await fs.promises.readdir(filepath)
	// 	console.log(files);
	// 	return this.checkfile(files, filepath);
	// }






















	// async findFiles(path, filename) {
	// 	let c = [];
	// 	let files = fs.readdirSync(path).forEach(file => {
	// 		let fullPath = Path.join(path, file);
	// 		console.log(fullPath)
	// 		if (fs.lstatSync(fullPath).isDirectory()) {
	// 			console.log(fullPath);
	// 			this.findFiles(fullPath, filename);
	// 		} else {
	// 			// console.log(fullPath)
	// 		}
	// 	});
	// 	console.log(files)

	// let searchResult = files.filter(file => file.match(new RegExp(`(${filename}).*\.`, 'ig')));
	// let result = { files: searchResult }
	// fs.writeFile(`search/search-${filename}.json`, JSON.stringify(result, null, 4), (err) => {
	// 	if (err) { console.error(err); return; };
	// 	console.log("File has been created");
	// });
	// return result;
	// }



	generateJwt(user: UserEntity): string {
		return sign({
			id: user.id,
			username: user.username,
			email: user.email
		}, JWT_SECRET)
	}

	buildUserResponse(user: UserEntity): UserResponseInterface {
		return {
			user: {
				...user,
				token: this.generateJwt(user)
			}
		}
	}

}
