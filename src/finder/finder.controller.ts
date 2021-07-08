import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { UserEntity } from 'src/auth/user.entity';
import { FilterDto } from './dto/filter.dto';
import { FinderService } from './finder.service';

@Controller('finder')
export class FinderController {
	private logger = new Logger('FinderController')

	constructor(private readonly finderService: FinderService) { }

	@Get()
	@UseGuards(AuthGuard)
	async findFiles(
		@User() user: UserEntity,
		@Query() filterDto: FilterDto
	) {
		this.logger.verbose(`User ${user.username} is searching: file: ${filterDto.filename}, path: ${filterDto.path}, extension: ${filterDto.extension}`)
		return await this.finderService.findFiles(filterDto);
	}
}
