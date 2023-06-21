import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBody,
  ApiHeader,
  ApiQuery,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { UserDTO, UserUpdateDTO } from './dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { User } from './entities';
import { FileInterceptor } from '@nestjs/platform-express';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { plainToClass, instanceToPlain } from 'class-transformer';
import { CompressImagePipe } from 'src/pipes/compress-image.pipe';

@UseGuards(LocalAuthGuard)
@ApiTags('Users')
@ApiHeader({ name: 'access_token', required: true })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'records', required: false })
  @ApiQuery({ name: 'page', required: false })
  @Get()
  async get(
    @Query('id') id: string,
    @Query('search') searchKeyword: string,
    @Query('records') records: string,
    @Query('page') page: string,
  ) {
    try {
      let data: any;

      if (+id) {
        data = await this.usersService.findOne(+id);
      } else
        data = await this.usersService.findAll(searchKeyword, +records, +page);

      if (data?.length > 0 || data) {
        const role = 'guest';
        data = await data.map((user: UserDTO) =>
          instanceToPlain(plainToClass(User, user, { groups: [role] }), {
            groups: [role],
          }),
        );
        return { message: 'Successfully!', data };
      } else {
        throw new NotFoundException();
      }
    } catch (err) {
      throw err || new InternalServerErrorException();
    }
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UserDTO,
  })
  @Post('new')
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Body() data: UserDTO,
    @UploadedFile(CompressImagePipe) avatar: Express.Multer.File,
  ) {
    try {
      const user = await this.usersService.create({
        ...data,
        avatar: avatar?.filename || null,
      });

      return {
        message: 'Successfully created!',
        data: (role = 'guest') =>
          instanceToPlain(plainToClass(User, user, { groups: [role] }), {
            groups: [role],
          }),
      };
    } catch (err) {
      throw err || new InternalServerErrorException();
    }
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UserUpdateDTO,
  })
  @Put('update/:id')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Param('id') id: string,
    @Body() data: UserUpdateDTO,
    @UploadedFile(CompressImagePipe) avatar: Express.Multer.File,
  ) {
    try {
      const updatedUser: UserDTO = await this.usersService.update(+id, {
        ...data,
        avatar: data.avatar !== null ? avatar?.filename : null,
      });
      return { message: 'Successfully updated!', data: updatedUser };
    } catch (err) {
      throw err || new InternalServerErrorException();
    }
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number) {
    try {
      await this.usersService.delete(+id);
      return { message: 'Successfully deleted!' };
    } catch (err) {
      throw err || new InternalServerErrorException();
    }
  }
}
