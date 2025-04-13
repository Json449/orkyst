import { ConfigService } from '@nestjs/config';
export declare class ConfigurationService {
    private readonly configService;
    constructor(configService: ConfigService);
    getOpenAiApiKey(): string;
}
