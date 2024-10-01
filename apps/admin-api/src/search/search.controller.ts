import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { AccessTokenGuard } from '@/common/guards/accessToken.guard';
import { SearchDto } from '@/search/dto/search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/')
  async globalSearch(@Query() searchDto: SearchDto) {
    const { query } = searchDto;
    return this.searchService.globalSearch(query);
  }
}
