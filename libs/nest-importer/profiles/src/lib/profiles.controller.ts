import { Controller, Get } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(
    private profilesService: ProfilesService
  ) {}

  @Get()
  findAll() {
    return this.profilesService.getUserList();
  }
}
