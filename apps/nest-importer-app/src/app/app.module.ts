import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SourcesModule } from '@homefunds/nest-importer/sources';

@Module({
  imports: [SourcesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
