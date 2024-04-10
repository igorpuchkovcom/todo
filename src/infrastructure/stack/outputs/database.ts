export default {
    DocumentDBURI: {
        Value: {
            'Fn::GetAtt': ['DocumentDBCluster', 'Endpoint']
        },
        Export: {
            Name: 'DocumentDBHost'
        }
    }
};
