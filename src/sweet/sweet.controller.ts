import { BadRequestException, Body, Controller, Delete, Get, Logger, Param, Patch, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { SweetService } from './sweet.service';
import { AuthGuard } from '@nestjs/passport';
import { SweetDto } from './sweet.dtos';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@Controller('sweet')
export class SweetController {
    constructor(
        private readonly sweetService : SweetService
    ){}
    @Get()
    getSweet(){
        return this.sweetService.getSweets()
    }
    @Get('/:id')
    getOneSweet(@Param('id') id : string){
        return this.sweetService.getSweet(id)
    }
    @Post()
    @UseGuards(AuthGuard())
    @UsePipes(ValidationPipe)
    @UseInterceptors(FilesInterceptor('images', null, {
        storage: diskStorage({
          destination: './uploads',
          filename: (_, file, callback) => {
            callback(null, `${Date.now()}-${file.originalname}`);
          },
        }),
      }))
    createSweet(@Req() req : any ,@Body() sweetDto : SweetDto , @UploadedFiles() files : any){
        if(!sweetDto.context && !files) throw new BadRequestException('context or image is required')
        let imagesArray : string[] = []
        if(files.length > 0) {
            imagesArray = files.map( v => 'uploads/' + v.filename)
        }
        return this.sweetService.createSweet(sweetDto , imagesArray , req.user)
    }
    @Patch('/:id')
    @UseGuards(AuthGuard())
    updateSweet (@Req() req : any , @Body() sweetDto : SweetDto , @Param('id') id : string){
        if(! sweetDto.context) throw new BadRequestException('title or context is required')
        return this.sweetService.updateSweet(sweetDto , id , req.user)
    }

    @Delete('/:id')
    @UseGuards(AuthGuard())
    deleteSweet(@Req() req:any , @Param('id') id : string){
        return this.sweetService.deleteSweet(id,req.user)
    }

    @Post('/bookmark/:id')
    @UseGuards(AuthGuard())
    addBookmark(@Param('id') id:string , @Req() req) {
        return this.sweetService.addBookmark(id,req.user)
    }

    @Delete('/bookmark/:id')
    @UseGuards(AuthGuard())
    removeBookmark(@Param('id') id:string , @Req() req){
        return this.sweetService.removeBookmark(id , req.user)
    }
    @Post('/like/:id')
    @UseGuards(AuthGuard())
    addLike(@Param('id') id:string , @Req() req){
        return this.sweetService.addLike(id , req.user) 
    }
    @Delete('/like/:id')
    @UseGuards(AuthGuard())
    deleteLike(@Param('id') id:string , @Req() req) {
        return this.sweetService.removeLike(id , req.user)  
    }
}

/*@Post('/comment/:id')
@UseGuards(AuthGuard())
addComment(@Param('id') id:string , @Req() req){
    return this.sweetService.removeBookmark(id , req.user)
}*/