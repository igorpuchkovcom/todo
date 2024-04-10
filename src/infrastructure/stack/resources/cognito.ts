export default {
    UserPool: {
        Type: 'AWS::Cognito::UserPool',
        Properties: {
            UserPoolName: 'TodoUserPool',
            UsernameAttributes: ['email'],
            AutoVerifiedAttributes: ['email'],
            VerificationMessageTemplate: {
                DefaultEmailOption: 'CONFIRM_WITH_CODE'
            },
            EmailConfiguration: {
                EmailSendingAccount: 'COGNITO_DEFAULT'
            }
        },
    },
    UserPoolClient: {
        Type: 'AWS::Cognito::UserPoolClient',
        Properties: {
            ClientName: 'TodoUserPoolClient',
            UserPoolId: {Ref: 'UserPool'},
            ExplicitAuthFlows: ['ALLOW_ADMIN_USER_PASSWORD_AUTH', 'ALLOW_CUSTOM_AUTH', 'ALLOW_USER_PASSWORD_AUTH', 'ALLOW_USER_SRP_AUTH', 'ALLOW_REFRESH_TOKEN_AUTH']
        },
    },
    ApiGatewayAuthorizer: {
        Type: 'AWS::ApiGateway::Authorizer',
        Properties: {
            Name: 'my-authorizer',
            RestApiId: {Ref: 'ApiGatewayRestApi'},
            Type: 'COGNITO_USER_POOLS',
            IdentitySource: 'method.request.header.Authorization',
            ProviderARNs: [
                {'Fn::GetAtt': ['UserPool', 'Arn']},
            ],
        },
    },
};
