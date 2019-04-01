import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  getHello(): string {
    return 'ODIN :: Admin Core successfully loaded!';
  }
}
