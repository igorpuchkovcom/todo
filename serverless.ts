import type {AWS} from '@serverless/typescript';
import register from '@functions/auth/register';
import login from '@functions/auth/login';
import createTask from '@functions/tasks/create';
import deleteTask from '@functions/tasks/delete';
import getTasks from '@functions/tasks/get';
import updateTask from '@functions/tasks/update';

const serverlessConfiguration: AWS = {
    service: 'todo',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild'],
    provider: {
        name: 'aws',
        runtime: 'nodejs20.x',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    // import the functions via paths
    functions: {
        register,
        login,
        createTask,
        deleteTask,
        getTasks,
        updateTask,
    },
    package: {individually: true},
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node20',
            define: {'require.resolve': undefined},
            platform: 'node',
            concurrency: 10,
        },
    },
    resources: {
        Resources: {
            UserPool: {
                Type: 'AWS::Cognito::UserPool',
                Properties: {
                    UserPoolName: 'TodoUserPool',
                    UsernameAttributes: ['email'],
                    AutoVerifiedAttributes: ['email'],
                    Policies: {
                        PasswordPolicy: {
                            MinimumLength: 8,
                            RequireLowercase: true,
                            RequireNumbers: true,
                            RequireSymbols: true,
                            RequireUppercase: true,
                        },
                    },
                },
            },
            UserPoolClient: {
                Type: 'AWS::Cognito::UserPoolClient',
                Properties: {
                    ClientName: 'TodoUserPoolClient',
                    UserPoolId: { Ref: 'UserPool' },
                },
            },
            VPC: {
                Type: 'AWS::EC2::VPC',
                Properties: {
                    CidrBlock: '10.0.0.0/16',
                    InstanceTenancy: 'default',
                },
            },
            Subnet1: {
                Type: 'AWS::EC2::Subnet',
                Properties: {
                    AvailabilityZone: 'us-east-1a',
                    CidrBlock: '10.0.64.0/18',
                    VpcId: {Ref: 'VPC'},
                },
            },
            Subnet2: {
                Type: 'AWS::EC2::Subnet',
                Properties: {
                    AvailabilityZone: 'us-east-1b',
                    CidrBlock: '10.0.128.0/18',
                    VpcId: {Ref: 'VPC'},
                },
            },
            DbSubnetGroup: {
                Type: 'AWS::RDS::DBSubnetGroup',
                Properties: {
                    DBSubnetGroupName: 'PrivateDbSubnet',
                    DBSubnetGroupDescription: 'PrivateDbSubnet',
                    SubnetIds: [{Ref: 'Subnet1'}, {Ref: 'Subnet2'}],
                },
            },
            DatabaseVpcSecurityGroup: {
                Type: 'AWS::EC2::SecurityGroup',
                Properties: {
                    GroupName: 'DBSecurityGroup',
                    GroupDescription: 'Allow local access',
                    SecurityGroupIngress: {
                        CidrIp: '10.0.0.0/16',
                        IpProtocol: 'tcp',
                        FromPort: '27017',
                        ToPort: '27017',
                    },
                    VpcId: {Ref: 'VPC'},
                },
            },
            DBInstance: {
                Type: 'AWS::DocDB::DBInstance',
                Properties: {
                    DBInstanceClass: 'db.t3.medium',
                    DBClusterIdentifier: {Ref: 'DocumentDBCluster'},
                },
            },
            DocumentDBCluster: {
                Type: 'AWS::DocDB::DBCluster',
                Properties: {
                    MasterUsername: 'tp',
                    MasterUserPassword: 'NQ7qIwic',
                    DBSubnetGroupName: {Ref: 'DbSubnetGroup'},
                    AvailabilityZones: ['us-east-1a', 'us-east-1b'],
                    StorageEncrypted: true,
                    VpcSecurityGroupIds: [{Ref: 'DatabaseVpcSecurityGroup'}],
                },
            },
        },
    },
};

module.exports = serverlessConfiguration;
