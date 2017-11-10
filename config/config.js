import Joi from 'joi';
// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

const envVarsSchema = Joi.object({
    SQLSERVER_CONNECTION_STRING: Joi.string().required().description("SQL Server connection"),
    REDIS_CONNECTION_STRING: Joi.string().required().description("SQL Server connection"),
  }).unknown()
    .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    sqlServerConnectionString: envVars.SQLSERVER_CONNECTION_STRING,
    redisConnectionString: envVars.REDIS_CONNECTION_STRING
};

export default config;