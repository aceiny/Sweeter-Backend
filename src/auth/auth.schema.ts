import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { Document, Types } from "mongoose";

@Schema()
export class User extends Document {
    @Prop()
    image : string;
    @Prop()
    name: string;
    @Prop({unique : true})
    email: string;
    @Prop({unique : true})
    username: string;
    @Prop()
    password: string;
    @Prop({default : Date.now})
    createdAt: Date;
    @Prop({type : [Types.ObjectId] , ref : 'Sweet'})
    bookmarks : Types.ObjectId[];
    @Prop({type : [Types.ObjectId] , ref : 'Sweet'})
    likes : Types.ObjectId[];
    @Prop({type : [Types.ObjectId] , ref : 'User'})
    followers : Types.ObjectId[];
    @Prop({type : [Types.ObjectId] , ref : 'User'})
    following : Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);