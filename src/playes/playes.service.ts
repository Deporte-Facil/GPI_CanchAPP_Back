import { Injectable } from '@nestjs/common';
import { CreatePlayeDto } from './dto/create-playe.dto';
import { UpdatePlayeDto } from './dto/update-playe.dto';

@Injectable()
export class PlayesService {
  create(createPlayeDto: CreatePlayeDto) {
    return 'This action adds a new playe';
  }

  findAll() {
    return `This action returns all playes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playe`;
  }

  update(id: number, updatePlayeDto: UpdatePlayeDto) {
    return `This action updates a #${id} playe`;
  }

  remove(id: number) {
    return `This action removes a #${id} playe`;
  }
}
