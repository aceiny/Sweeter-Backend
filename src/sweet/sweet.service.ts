import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sweet } from './sweet.schema';
import { Model } from 'mongoose';
import { SweetDto } from './sweet.dtos';
import { User } from 'src/auth/auth.schema';

@Injectable()
export class SweetService {
    constructor(
        @InjectModel(Sweet.name)
        private sweetModel : Model<Sweet>,
        @InjectModel(User.name)
        private userModel : Model<User>
    ){}
    async getSweets() : Promise<Sweet[]> {
        return await this.sweetModel.find().populate('author' , '-password').populate('likes','-password').populate('bookmarks','-pasoword')
    }
    async getSweet(id : string) : Promise<Sweet> {
        const sweet = await this.sweetModel.findById(id).populate('author' , '-password').populate('likes','-password').populate('bookmarks','-pasoword')
        if(!sweet){
            throw new NotFoundException('Sweet not found')
        }
        return sweet     
    }
    async createSweet(sweetDto : SweetDto , images : string[] , user : User) : Promise<Sweet> {
        try{
            const info = {
                context : sweetDto.context,
                author : user.id,
                images
            }
            const sweet = await this.sweetModel.create(info)
            return sweet
        }catch(err){
            throw new InternalServerErrorException('Sweet not created');
        }
    }
    async updateSweet(sweetDto : SweetDto , id : string , user : User) : Promise<Sweet> {
        try{
            const sweet = await this.sweetModel.findOneAndUpdate({ _id : id , author : user.id } , sweetDto , {new : true})
            if(!sweet){
                throw new NotFoundException('sweet Not Found')
            }
            return sweet
        }catch(err){
            throw new NotFoundException('sweet Not Found')
        }
    }
    async deleteSweet(id : string , user ) : Promise<any> {
        try{
            const sweet = await this.sweetModel.findOneAndDelete({_id : id , author : user.id})
            if(!sweet){
                throw new NotFoundException('sweet not found')
            }
            return sweet
        }
        catch(err){
            throw new NotFoundException('sweet not found')
        }
    }

    async addBookmark(id : string , user : User)  : Promise<Sweet> {
            console.log(id , user)
            const sweet = await this.sweetModel.findOne({_id : id})
            if(!sweet) {
                throw new NotFoundException('sweet not found')
            }
            const exist = sweet.bookmarks.find(v => v == user.id)
            if(exist){
                throw new ConflictException('user already bookmarked')
            }
            const userObj = await this.userModel.findById(user.id)
            if(!userObj){
                throw new NotFoundException('user not found')
            }
            userObj.bookmarks.push(sweet.id)
            sweet.bookmarks.push(user.id)
            await sweet.save()
            await userObj.save()
            return sweet
    }
    async removeBookmark(id : string , user : User)  : Promise<Sweet> {
        console.log(id , user)
        const sweet = await this.sweetModel.findOne({_id : id})
        if(!sweet) {
            throw new NotFoundException('sweet not found')
        }
        const exist = sweet.bookmarks.find(v => v == user.id)
        if(!exist){
            throw new ConflictException('user not bookmarked')
        }
        const userObj = await this.userModel.findById(user.id)
        if(!userObj){
            throw new NotFoundException('user not found')
        }
        userObj.bookmarks = userObj.bookmarks.filter(v => v != sweet.id)
        sweet.bookmarks = sweet.bookmarks.filter(v => v != user.id)
        await sweet.save()
        await userObj.save()
        return sweet
    }
    async addLike(id : string , user : User)  : Promise<Sweet> {
        console.log(id , user)
        const sweet = await this.sweetModel.findOne({_id : id})
        if(!sweet) {
            throw new NotFoundException('sweet not found')
        }
        const exist = sweet.likes.find(v => v == user.id)
        if(exist){
            throw new ConflictException('user already liked')
        }
        const userObj = await this.userModel.findById(user.id)
        if(!userObj){
            throw new NotFoundException('user not found')
        }
        userObj.likes.push(sweet.id)
        sweet.likes.push(user.id)
        await sweet.save()
        await userObj.save()
        return sweet
    }
    async removeLike(id : string , user : User)  : Promise<Sweet> {
        console.log(id , user)
        const sweet = await this.sweetModel.findOne({_id : id})
        if(!sweet) {
            throw new NotFoundException('sweet not found')
        }
        const exist = sweet.likes.find(v => v == user.id)
        if(!exist){
            throw new ConflictException('user not liked')
        }
        const userObj = await this.userModel.findById(user.id)
        if(!userObj){
            throw new NotFoundException('user not found')
        }
        userObj.likes = userObj.likes.filter(v => v != sweet.id)
        sweet.likes = sweet.likes.filter(v => v != user.id)
        await sweet.save()
        await userObj.save()
        return sweet
    }
}
