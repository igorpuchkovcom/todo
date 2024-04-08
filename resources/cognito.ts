export default {
    UserPool: {
        Type: 'AWS::Cognito::UserPool',
        Properties: {
            UserPoolName: 'TodoUserPool',
            UsernameAttributes: ['email'],
            AutoVerifiedAttributes: ['email']
        },
    },
    UserPoolClient: {
        Type: 'AWS::Cognito::UserPoolClient',
        Properties: {
            ClientName: 'TodoUserPoolClient',
            UserPoolId: { Ref: 'UserPool' },
        },
    },
    ApiGatewayAuthorizer: {
        Type: 'AWS::ApiGateway::Authorizer',
        Properties: {
            Name: 'my-authorizer',
            RestApiId: { Ref: 'ApiGatewayRestApi' },
            Type: 'COGNITO_USER_POOLS',
            IdentitySource: 'method.request.header.Authorization',
            ProviderARNs: [
                { 'Fn::GetAtt': ['UserPool', 'Arn'] },
            ],
        },
    },
};
