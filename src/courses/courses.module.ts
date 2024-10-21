import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [
    ClientsModule.register([
      {
        name: 'COURSES_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'courses',
          protoPath: join(__dirname, './proto/courses.proto'),
          url: 'localhost:50051',
        }
      }
    ])
  ]
})
export class CoursesModule {}
