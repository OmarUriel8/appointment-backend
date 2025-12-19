import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  PaginationUserDto,
  UpdatePasswordDto,
} from './dto';
import { UserRole } from './enums/user-role.enum';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Auth(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Auth(UserRole.ADMIN)
  findAll(@Query() paginationUserDto: PaginationUserDto) {
    return this.userService.findAll(paginationUserDto);
  }

  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string) {
    return this.userService.findOne(term);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN, UserRole.CLIENT, UserRole.EMPLOYEE)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.userService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }

  @Patch('change-password/:term')
  changePassword(
    @Param('term', ParseUUIDPipe) term: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.changePassword(term, updatePasswordDto);
  }
}
