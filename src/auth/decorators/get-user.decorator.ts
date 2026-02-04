import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthedRequest, AuthUser } from '../interfaces/req-user.interface';

export const GetUser = createParamDecorator(
  (data: keyof AuthUser, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    const user = req.user;

    if (!user)
      throw new InternalServerErrorException('User not found in request');

    return data ? user[data] : user;
  },
);
