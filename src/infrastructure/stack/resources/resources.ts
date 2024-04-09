import vpcConfig from './vpc';
import securityGroupConfig from './securityGroup';
import databaseConfig from './database';
import cognitoConfig from './cognito';

const resourcesConfig = {
    ...vpcConfig,
    ...securityGroupConfig,
    ...databaseConfig,
    ...cognitoConfig,
};

export default resourcesConfig;