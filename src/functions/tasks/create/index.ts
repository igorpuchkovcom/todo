import {handlerPath} from '../../../libs/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.app`,
    events: [
        {
            http: {
                method: 'post',
                path: 'tasks/create',
                authorizer: {
                    type: 'COGNITO_USER_POOLS',
                    authorizerId: {Ref: 'ApiGatewayAuthorizer'},
                },
            },
        },
    ],
};
