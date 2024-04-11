import {handlerPath} from '../../../libs/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.app`,
    events: [
        {
            http: {
                method: 'put',
                path: 'tasks/update',
                authorizer: {
                    type: 'COGNITO_USER_POOLS',
                    authorizerId: {Ref: 'ApiGatewayAuthorizer'},
                },
            },
        },
    ],
};
