import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [ClientsModule.register([
    { name: 'AUTH_SERVICE', transport: Transport.NATS, options: { url: 'nats://localhost:4222' } }
  ]) ],
  exports: [ClientsModule]
})
export class AuthModule {}
