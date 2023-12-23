import { Module } from '@nestjs/common';
import { SweetController } from './sweet.controller';
import { SweetService } from './sweet.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Sweet, SweetSchema } from './sweet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name : Sweet.name , schema : SweetSchema}]),
    AuthModule,
  ],
  controllers: [SweetController],
  providers: [SweetService]
})
export class SweetModule {}
