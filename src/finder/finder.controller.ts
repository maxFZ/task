import { Controller, Get, Logger, Param, Query, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { UserEntity } from 'src/auth/user.entity';
import { FilterDto } from './dto/filter.dto';
import { FileEntity } from './file.entity';
import { FinderService } from './finder.service';

@Controller('finder')
export class FinderController {
	private logger = new Logger('FinderController')

	constructor(private readonly finderService: FinderService) { }

	@Get()
	@UseGuards(AuthGuard)
	async loadFiles(
		@User() user: UserEntity,
		@Query() filterDto: FilterDto
	) {
		this.logger.verbose(`User ${user.username} is searching: file: ${filterDto.filename}, path: ${filterDto.path}, extension: ${filterDto.extension}`)
		const files = await this.finderService.getFiles(filterDto.path, null);
		return await this.finderService.filteredFiles(files);
	}

	@Get(':serchText')
	@UseGuards(AuthGuard)
	async findFiles(@Param('serchText') serchText: string): Promise<{ result: FileEntity[] }> {
		return this.finderService.findFiles(serchText);
	}
}