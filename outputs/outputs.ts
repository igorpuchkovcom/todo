import cognitoConfig from './cognito';
import databaseConfig from './database';

const outputsConfig = {
    ...cognitoConfig,
    ...databaseConfig,
};

export default outputsConfig;