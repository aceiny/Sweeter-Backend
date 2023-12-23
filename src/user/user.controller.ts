import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { query } from 'express';

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
    
}
