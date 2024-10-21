import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnApplicationBootstrap {
  private logger = new Logger('AuthService');
  private clientAuth: ClientProxy;
  async onApplicationBootstrap() {
    this.clientAuth = ClientProxyFactory.create({
      transport: Transport.NATS,
      options: {
        url: 'nats://localhost:4222',
      }
    });
    
    await this.clientAuth.connect();
    this.logger.log('Connected to courses microservice');
  }

  async login(payload) {
    return firstValueFrom(this.clientAuth.send('auth.login', payload));
  }
}
