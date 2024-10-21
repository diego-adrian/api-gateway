import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ClientGrpc, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import axios from 'axios';
import { CHANNEL_NOTIFICATION, coursesMessagePattern, QUEUE_SERVICE } from '../constants';
import { CreateCourseDto } from './dto/create-course.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CoursesService implements OnApplicationBootstrap {
  // private client: ClientProxy;
  private server;
  private clientNats: ClientProxy;
  private logger = new Logger('CoursesService');

  constructor(
    @Inject('COURSES_SERVICE') private readonly client: ClientGrpc,
  ) {}

  async onApplicationBootstrap() {
    this.clientNats = ClientProxyFactory.create({
      transport: Transport.NATS,
      options: {
        url: 'nats://localhost:4222',
      }
    });
    this.server = this.client.getService('CoursesService');
    await this.clientNats.connect();
    this.logger.log('Connected to courses microservice');
  }

  async findAll() {
    // const data = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    // return data.data;
    return firstValueFrom(this.clientNats.send(coursesMessagePattern.GET_ALL_COURSES, {}));
  }

  async findOne(id: string) {
    return firstValueFrom(this.server.getCourse({ id }));
  }

  create(data: CreateCourseDto) {
    // return this.client.send({ cmd: coursesMessagePattern.CREATE_COURSE }, data);
  }

  async update(id: string, body) {
    // const response = await this.client.send({ cmd: coursesMessagePattern.UPDATE_COURSE }, { id, ...body });
    // if (response) {
    //   await this.client.emit({ cmd: CHANNEL_NOTIFICATION }, {});
    // }
    // return response;
  }
}
