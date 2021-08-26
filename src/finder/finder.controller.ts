import { Controller, Get, Logger, Param, Query, UseGuards } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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
	@Cron('0 10 * * * *	')
	async loadFiles(
	) {
		const files = await this.finderService.getFiles('.', null);
		return await this.finderService.filteredFiles(files);
	}

	@Get(':serchText')
	@UseGuards(AuthGuard)
	async findFiles(@Param('serchText') serchText: string): Promise<{ result: FileEntity[] }> {
		return this.finderService.findFiles(serchText);
	}
}
