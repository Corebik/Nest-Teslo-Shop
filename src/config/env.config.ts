export const EnvConfiguration = () => ({
  // Application variables
  environment: process.env.NODE_ENV,
  port: +process.env.PORT!,
  hostApi: process.env.HOST_API,

  // Database variables
  dbHost: process.env.DB_HOST,
  dbPort: +process.env.DB_PORT!,
  dbName: process.env.DB_NAME,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,

  // JWT variables
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
});
