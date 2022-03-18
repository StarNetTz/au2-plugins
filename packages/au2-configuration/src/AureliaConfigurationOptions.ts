
import { DI } from '@aurelia/kernel';

export interface IAureliaConfigurationOptions {
	dir: string;
	file: string;
}

export const IAureliaConfigurationOptions = DI.createInterface<IAureliaConfigurationOptions>('IAureliaConfigurationOptions');

export const DefaultAureliaConfigurationOptions : IAureliaConfigurationOptions = {
	dir : "config",
	file : "config.json"
}