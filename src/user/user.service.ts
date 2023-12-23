import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/auth.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userService : Model<User>
    ){}
    async getUsers (filters) : Promise<User[]>{
        let Qobj : any  = {}
        if(filters.name){
            Qobj.name = { $regex: new RegExp(filters.name, 'i') }
        }
        if(filters.username){
            Qobj.username = { $regex: new RegExp(filters.username, 'i') }
        }
        
        return await this.userService.find(Qobj)
    }
    async getUser (id) : Promise<User>{
        try{
            const user = await this.userService.findById(id)
            if(!user ){
                throw new NotFoundException()
            }
            return user
        }catch(err){
            throw new NotFoundException('User Not found')
        }
    }
}
