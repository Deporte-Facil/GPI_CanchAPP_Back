import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnclosureService } from './enclosure.service';
import { CreateEnclosureDto } from './dto/create-enclosure.dto';
import { UpdateEnclosureDto } from './dto/update-enclosure.dto';

@Controller('enclosure')
export class EnclosureController {
  constructor(private readonly enclosureService: EnclosureService) {}

  @Post()
  create(@Body() createEnclosureDto: CreateEnclosureDto) {
    return this.enclosureService.create(createEnclosureDto);
  }

  @Get()
  findAll() {
    return this.enclosureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enclosureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnclosureDto: UpdateEnclosureDto) {
    return this.enclosureService.update(+id, updateEnclosureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enclosureService.remove(+id);
  }
}
