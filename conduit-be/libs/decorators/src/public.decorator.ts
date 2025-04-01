import { SetMetadata } from '@nestjs/common';

// map: key value

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
