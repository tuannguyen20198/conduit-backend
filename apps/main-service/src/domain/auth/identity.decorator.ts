import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Identity = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;

  return data ? user[data] : user;
});
