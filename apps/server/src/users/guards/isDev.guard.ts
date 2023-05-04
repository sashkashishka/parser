import { CanActivate, Injectable } from '@nestjs/common'
import { envVariables } from 'src/constants';

@Injectable()
export class IsDev implements CanActivate {
  canActivate() {
    return envVariables.getVariable('NODE_ENV') === 'development'; 
  }
}
