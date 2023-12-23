import { IsOptional, IsString } from "class-validator"

export class SweetDto {
    @IsOptional()
    context : string
    @IsOptional()
    images : string[]
}