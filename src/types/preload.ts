import type { Express } from 'express';
import { IncomingMessage, Server, ServerResponse } from 'http';

export type Preload = (
	input: PreloadExport,
) => Promise<PreloadExport> | PreloadExport;

interface PreloadExport {
	app: Express;
	server: Server<typeof IncomingMessage, typeof ServerResponse>;
}
