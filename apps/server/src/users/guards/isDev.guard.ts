import { CanActivate, Injectable } from '@nestjs/common'
import { IS_DEV } from 'src/constants';

@Injectable()
export class IsDev implements CanActivate {
  canActivate() {
    return IS_DEV; 
  }
}
