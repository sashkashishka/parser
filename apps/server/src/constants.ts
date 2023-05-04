type tVariables = 'HASH_SALT' | 'JWT_SECRET' | 'NODE_ENV';

class EnvVariables {
  private createError(variable: string) {
    return new Error(`Provide this env variable: "${variable}"`);
  }

  public getVariable(variable: tVariables) {
    const envVar = process.env[variable];

    if (!envVar) {
      throw this.createError(variable);
    }

    return envVar;
  }
}

export const envVariables = new EnvVariables();
