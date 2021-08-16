import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { getRepository, Repository, SimpleConsoleLogger } from 'typeorm';
import { FileEntity } from './file.entity';
import { FolderEntity } from './folder.entity';
const fs = require('fs');
const crypto = require('crypto');

@Injectable()
export class FinderService {
	constructor(
		@InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
		@InjectRepository(FolderEntity) private readonly folderRepository: Repository<FolderEntity>,
	) { }

	async findFiles(serchText: string): Promise<{ result: FileEntity[] }> {
		const result = await getRepository(FileEntity)
			.createQueryBuilder("file")
			.where('file.data ILIKE :searchTerm', { searchTerm: `%${serchText}%` })
			.select(['file.name', 'file.path', 'file.id'])
			.getMany();
		return { result };
	}


	async getFiles(dir, files_): Promise<any> {
		files_ = files_ || [];
		let files = fs.readdirSync(dir);
		for (let i in files) {
			let newName = dir + '/' + files[i];
			if (fs.statSync(newName).isDirectory()) {
				this.getFiles(newName, files_);
			} else {
				files_.push(newName);
			};
		}
		return files_;
	}

	async filteredFiles(files): Promise<[]> {
		for (let i in files) {
			const file = await this.fileRepository.findOne({ path: files[i] })
			if (!file) {
				const file = new FileEntity();
				file.name = this.getFileName(files[i]);
				file.path = files[i];
				file.parentDir = this.getParentDir(files[i]);
				const { data, generatedmd5 } = await this.getDataFromFile(files[i]);
				file.data = data;
				file.hash = generatedmd5;
				this.fileRepository.save(file);
			} else {
				const { data, generatedmd5 } = await this.getDataFromFile(files[i])
				if (generatedmd5 === file.hash) {
					continue;
				}
				file.data = data;
				file.hash = generatedmd5;
				this.fileRepository.save(file);
				console.log('file is resaved ' + file.name);
			}
		}
		return files;
	}

	async getDataFromFile(elem: string): Promise<{ data: string, generatedmd5: string }> {
		const data = await fs.readFileSync(elem, 'utf8');
		const generatedmd5 = crypto.createHash('md5').update(data).digest('hex');
		return { data, generatedmd5 }
	}

	getParentDir(elem: string): string {
		const splittedString = elem.split('/');
		const parentDir = splittedString[splittedString.length - 2]
		if (parentDir === '') {
			return 'src'
		}
		return parentDir;
	}

	getFileName(elem: string): string {
		const splittedString = elem.split('/');
		const fileName = splittedString[splittedString.length - 1];
		return fileName;
	}
}

