import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestWithUserInfo, Response } from '../core/types';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  @ApiBearerAuth()
  @ApiResponse({
    schema: {
      example: {
        status: 'ok',
        response: {
          id: 6,
          email: 'sofiia.sokolova.dev@gmail.com',
          createdAt: '2021-03-15T00:09:11.281Z',
        },
      },
    },
    status: 201,
  })
  async getMyself(
    @Req() { account: { id } }: RequestWithUserInfo,
  ): Promise<Response> {
    const user = await this.userService.findById(id);
    return Response.ok(user);
  }
}
