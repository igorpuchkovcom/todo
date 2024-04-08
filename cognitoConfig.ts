export default {
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
};
