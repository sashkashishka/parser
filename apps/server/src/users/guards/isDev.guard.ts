import { CanActivate, Injectable } from '@nestjs/common'

@Injectable()
export class IsDev implements CanActivate {
  canActivate() {
    return process.env.NODE_ENV === 'development'; 
  }
}
