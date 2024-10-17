import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import axios from 'axios';
import { CHANNEL_NOTIFICATION, coursesMessagePattern, QUEUE_SERVICE } from '../constants';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService implements OnApplicationBootstrap {
  private client: ClientProxy;
  private logger = new Logger('CoursesService');
  async onApplicationBootstrap() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.HOST_MICROSERVICE_COURSE],
        queue: QUEUE_SERVICE,
        persistent: true,
        queueOptions: {
          durable: true
        }
      }
    });

    await this.client.connect();
    this.logger.log('Connected to courses microservice');
  }

  async findAll() {
    // const data = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    // return data.data;
    return this.client.send(coursesMessagePattern.GET_ALL_COURSES, {});
  }

  create(data: CreateCourseDto) {
    return this.client.send({ cmd: coursesMessagePattern.CREATE_COURSE }, data);
  }

  async update(id: string, body) {
    const response = await this.client.send({ cmd: coursesMessagePattern.UPDATE_COURSE }, { id, ...body });
    if (response) {
      await this.client.emit({ cmd: CHANNEL_NOTIFICATION }, {});
    }
    return response;
  }
}
