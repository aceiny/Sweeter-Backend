import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema()
export class Sweet extends Document {

    @Prop()
    context : string
    @Prop() 
    images : string[]
    @Prop({type : Types.ObjectId, ref : 'User'})
    author : Types.ObjectId
    @Prop({type : [Types.ObjectId] , ref : 'User'})
    bookmarks : Types.ObjectId[]
    @Prop({type : [Types.ObjectId] , ref : 'User'})
    likes : Types.ObjectId[]
    @Prop({type : [Types.ObjectId] , ref : 'User'})
    comments : Types.ObjectId[]
}

export const SweetSchema = SchemaFactory.createForClass(Sweet);