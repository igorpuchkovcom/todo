import type { AWS } from '@serverless/typescript';
import functions from './src/functions/functions';
import resources from './src/infrastructure/stack/resources/resources';
import outputs from './src/infrastructure/stack/outputs/outputs';

const serverlessConfiguration: AWS = {
    service: 'todo',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-exports-plugin', 'serverless-dotenv-plugin'],
    provider: {
        name: 'aws',
        runtime: 'nodejs16.x',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    functions,
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node16',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
        exports: {
            stack: {
                file: '.env',
                format: 'env',
                overwrite: true,
            }
        }
    },
    resources: {
        Resources: resources,
        Outputs: outputs,
    },
};

module.exports = serverlessConfiguration;
