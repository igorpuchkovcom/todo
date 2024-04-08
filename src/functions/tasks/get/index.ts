import { handlerPath } from '@libs/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: 'get',
                path: 'tasks/get',
                authorizer: {
                    type: 'COGNITO_USER_POOLS',
                    authorizerId: { Ref: 'ApiGatewayAuthorizer' },
                },
            },
        },
    ],
};
