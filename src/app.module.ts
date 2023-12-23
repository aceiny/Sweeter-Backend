import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SweetModule } from './sweet/sweet.module';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from './user/user.module';
@Module({
  imports: [
     MongooseModule.forRoot(process.env.MONGO_URI) , 
     MulterModule.register({
        dest : './uploads'
     }),
     AuthModule, SweetModule, UserModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
