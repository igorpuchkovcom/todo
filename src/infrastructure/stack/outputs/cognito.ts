export default {
    UserPoolClientId: {
        Value: {
            Ref: 'UserPoolClient'
        },
        Export: {
            Name: 'UserPoolClientId'
        }
    }
};
