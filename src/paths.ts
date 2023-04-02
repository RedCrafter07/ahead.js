import path from 'path';
import { cwd } from 'process';

export const root = __dirname;
export const aheadDir = path.join(cwd(), '.ahead');
