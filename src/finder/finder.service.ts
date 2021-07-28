import { Injectable } from '@nestjs/common';
import readdirp from 'readdirp';
// import * as fs from 'fs'
import { FilterDto } from './dto/filter.dto';
const fs = require('fs');

const path = require('path');

@Injectable()
export class FinderService {


	async getFiles(dir, files_) {
		files_ = files_ || [];
		let files = fs.readdirSync(dir);

		for (let i in files) {
			let newName = dir + '/' + files[i];
			if (fs.statSync(newName).isDirectory()) {
				this.getFiles(newName, files_);
			} else {
				files_.push(newName);
			}
		}
		return files_;
	}

	async filteredFiles(files: any, filterDto: FilterDto) {
		const logname = new Date().getTime();
		let { filename, extension } = filterDto

		if (filename === undefined) {
			filename = ''
		}

		if (extension === undefined) {
			extension = ''
		}

		let searchResult = files.filter(file => file.match(new RegExp(`(${filename}).*\.(${extension})`, 'ig')));
		let result = { files: searchResult }
		fs.writeFile(`search/${logname}.json`, JSON.stringify(result, null, 4), (err) => {
			if (err) { console.error(err); return; };
			console.log("File has been created");
		});
		return result;
	}
	// return searchResult;

}

}
