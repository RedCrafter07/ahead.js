export type Preload = (
	app: Express.Application,
) => Promise<Express.Application> | Express.Application;
