import type { Express } from 'express';

export type Preload = (app: Express) => Promise<Express> | Express;
