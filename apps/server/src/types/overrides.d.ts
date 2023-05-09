import { iJwtPayload } from "./jwtPayload";

declare module 'fastify' {
  interface FastifyRequest {
    user: iJwtPayload;
  }
}

declare module 'socket.io' {
  interface Socket {
    user: iJwtPayload;
  }
}
