import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  getOpenAiApiKey(): string {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY_CHECK');
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY in environment variables');
    }
    return apiKey;
  }
}
