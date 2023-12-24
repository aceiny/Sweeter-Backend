import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/auth.schema';
import * as  bcrypt from 'bcrypt'
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
        
        return await this.userService.find(Qobj , '-password')
    }
    async getUser (id) : Promise<User>{
        try{
            const user = await this.userService.findById(id , '-password').populate('bookmarks likes' , '-password')
            if(!user ){
                throw new NotFoundException()
            }
            return user
        }catch(err){
            throw new NotFoundException('User Not found')
        }
    }
    async updateUsername(user : any , username:string) : Promise<User>{
        const exist = await this.userService.findOne({username , _id : {$ne : user.id}})
        if(exist){
            throw new NotFoundException('Username already exist')
        }

        const userObj = await this.userService.findById(user.id , '-password')
        if(userObj.username === username ) return userObj
        if(!userObj){
            throw new NotFoundException('User Not found')
        }
        userObj.username = username
        await userObj.save()
        return userObj
    }
    async changePassword(user : any , password:string) : Promise<User>{
        const userObj = await this.userService.findById(user.id , '-password')
        if(!userObj){
            throw new NotFoundException('User Not found')
        }
        const salt = bcrypt.genSaltSync(10)
        userObj.password = bcrypt.hashSync(password , salt)
        await userObj.save()
        return userObj
    }
    async changeImage(user : any , image:string) : Promise<User>{
        const userObj = await this.userService.findById(user.id , '-password')
        if(!userObj){
            throw new NotFoundException('User Not found')
        }
        userObj.image = image
        await userObj.save()
        return userObj
    }
    async followUser(id:string , user:any) : Promise<User>{
        const userObj = await this.userService.findById(user.id , '-password')
        if(!userObj){
            throw new NotFoundException('User Not found')
        }
        const userToFollow = await this.userService.findById(id , '-password')
        if(!userToFollow){
            throw new NotFoundException('User Not found')
        }
        const exist = userObj.following.find(v =>v.toString() == userToFollow._id.toString())
        if(exist){
            throw new ConflictException('user already followed')
        }

        userObj.following.push(userToFollow._id)
        userToFollow.followers.push(userObj._id)
        await userObj.save()
        await userToFollow.save()
        return userObj
    }
    async unfollowUser(id:string , user:any) : Promise<User>{
        const userObj = await this.userService.findById(user.id , '-password')
        if(!userObj){
            throw new NotFoundException('User Not found')
        }
        const userToUnfollow = await this.userService.findById(id , '-password')
        if(!userToUnfollow){
            throw new NotFoundException('User Not found')
        }
        const exist = userObj.following.find(v =>v.toString() == userToUnfollow._id.toString())
        if(!exist){
            throw new ConflictException('user not followed')
        }

        userObj.following = userObj.following.filter(v => v.toString() != userToUnfollow._id.toString())
        userToUnfollow.followers = userToUnfollow.followers.filter(v => v.toString() != userObj._id.toString())
        await userObj.save()
        await userToUnfollow.save()
        return userObj
    }
}
