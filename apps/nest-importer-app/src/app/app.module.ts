import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SourcesModule } from '@homefunds/nest-importer/sources';
import { ProfilesModule } from '@homefunds/nest-importer/profiles';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({  isGlobal: true }),
    SourcesModule,
    ProfilesModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
