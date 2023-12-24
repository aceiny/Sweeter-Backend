import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { query } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from 'multer'
@Controller('user')
export class UserController {
    constructor(
        private readonly userService : UserService
    ){}
    @Get()
    getUsers(@Query() filters){
        return this.userService.getUsers(filters)
    }
    @Get('/:id')
    getUser(@Param('id') id:string){
        return this.userService.getUser(id)
    }
    @Patch('/username')
    @UseGuards(AuthGuard())
    updateUsername(@Body('username') username:string , @Req() req:any){
        if(!username) throw new NotFoundException('Username is required')
        return this.userService.updateUsername(req.user, username)
    }
    @Patch('/password')
    @UseGuards(AuthGuard())
    updatePassword(@Body('password') password:string , @Req() req:any){
        if(!password) throw new NotFoundException('Password is required')
        return this.userService.changePassword(req.user, password)
    }
    @Patch('/image')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
          destination: './uploads',
          filename: (_, file, callback) => {
            callback(null, `${Date.now()}-${file.originalname}`);
          },
        }),
      }))
    updateImage(@UploadedFile() image:any, @Req() req:any){
        if(!image) throw new BadRequestException('image is required')
        const imagePath = 'uploads/' + image.filename
        return this.userService.changeImage(req.user, imagePath)
    }
    @Post('follow/:id')
    @UseGuards(AuthGuard())
    followUser(@Param('id') id:string , @Req() req:any){
        if(!id) throw new BadRequestException('id is required')
        if(id == req.user.id) throw new BadRequestException('You can not follow yourself')
        return this.userService.followUser(id, req.user)
    }
    @Post('unfollow/:id')
    @UseGuards(AuthGuard())
    unfollowUser(@Param('id') id:string , @Req() req:any){
        if(!id) throw new BadRequestException('id is required')
        if(id == req.user.id) throw new BadRequestException('You can not unfollow yourself')
        return this.userService.unfollowUser(id, req.user)
    }
    
}
