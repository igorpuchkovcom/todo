import vpcConfig from './vpcConfig';
import securityGroupConfig from './securityGroupConfig';
import databaseConfig from './databaseConfig';
import cognitoConfig from './cognitoConfig';

const resourcesConfig = {
    ...vpcConfig,
    ...securityGroupConfig,
    ...databaseConfig,
    ...cognitoConfig,
};

export default resourcesConfig;