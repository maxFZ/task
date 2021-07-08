import { Injectable } from '@nestjs/common';
import readdirp from 'readdirp';
import * as fs from 'fs'
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class FinderService {

	async findFiles(filterDto: FilterDto) {
		let { path, filename, extension } = filterDto



		if (filename === undefined) {
			filename = ''
		}

		if (extension === undefined) {
			extension = ''
		}




		const logname = new Date().getTime();
		console.log(filterDto.path)
		let filesFromDirectory = []
		const files = await readdirp.promise(path);
		filesFromDirectory = (files.map(file => file.path));
		console.log(filesFromDirectory)


		let searchResult = filesFromDirectory.filter(file => file.match(new RegExp(`(${filename}).*\.(${extension})`, 'ig')));
		let result = { files: searchResult }
		fs.writeFile(`search/${logname}.json`, JSON.stringify(result, null, 4), (err) => {
			if (err) { console.error(err); return; };
			console.log("File has been created");
		});
		return result;
	}

}