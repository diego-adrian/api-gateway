import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { coursesMessagePattern } from '../constants';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService implements OnApplicationBootstrap {
  private client: ClientProxy;
  private logger = new Logger('CoursesService');
  async onApplicationBootstrap() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.HOST_MICROSERVICE_COURSE,
        port: +process.env.HOST_MICROSERVICE_PORT
      },
    });

    await this.client.connect();
    this.logger.log('Connected to courses microservice');
  }

  findAll() {
    return this.client.send({ cmd: coursesMessagePattern.GET_ALL_COURSES }, {});
  }

  create(data: CreateCourseDto) {
    return this.client.send({ cmd: coursesMessagePattern.CREATE_COURSE }, data);
  }
}
