declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEST_TEMP_PORT: number;
      NEST_TEMP_NODE_ENV: 'development' | 'staging' | 'production';
      NEST_TEMP_API_BASE_URL: string;
      NEST_TEMP_THROTTLE_LIMIT: string;
      NEST_TEMP_THROTTLE_TTL: string;
      NEST_TEMP_DB_TYPE: 'postgres';
      NEST_TEMP_DB_HOST: string;
      NEST_TEMP_DB_PORT: number;
      NEST_TEMP_DB_USERNAME: string;
      NEST_TEMP_DB_PASSWORD: string;
      NEST_TEMP_DB_NAME: string;
      NEST_TEMP_JWT_ACCESS_TOKEN_SECRET: string;
      NEST_TEMP_JWT_ACCESS_TOKEN_EXPIRATION: string;
      NEST_TEMP_JWT_REFRESH_TOKEN_SECRET: string;
      NEST_TEMP_JWT_REFRESH_TOKEN_EXPIRATION: string;
    }
  }
}

export {};
