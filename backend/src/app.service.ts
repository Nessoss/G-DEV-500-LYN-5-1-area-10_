import { Injectable } from '@nestjs/common';
import type { AboutResponse } from './interfaces/about.interface';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getAbout(): AboutResponse {
    const currentTime = Math.floor(Date.now() / 1000);

    return {
      client: {
        host: '127.0.0.1',
      },
      server: {
        current_time: currentTime,
        services: [], // Structure vide initiale comme demandé dans le PRD
      },
    };
  }
}
