import { Module } from '@nestjs/common';
import { SweetController } from './sweet.controller';
import { SweetService } from './sweet.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Sweet, SweetSchema } from './sweet.schema';
import { User, UserSchema } from 'src/auth/auth.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name : Sweet.name , schema : SweetSchema}]),
    MongooseModule.forFeature([{name : User.name , schema : UserSchema}]),
    AuthModule,
  ],
  controllers: [SweetController],
  providers: [SweetService]
})
export class SweetModule {}
