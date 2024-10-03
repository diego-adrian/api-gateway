import { Module } from '@nestjs/common';
import { CoursesModule } from './courses/courses.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), CoursesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
