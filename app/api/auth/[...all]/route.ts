import { toNextJsHandler } from 'better-auth/next-js';

import { auth } from '@/utils/auth/auth';

export const { POST, GET } = toNextJsHandler(auth);
