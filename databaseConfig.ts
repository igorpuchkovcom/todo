export default {
    DBInstance: {
        Type: 'AWS::DocDB::DBInstance',
        Properties: {
            DBInstanceClass: 'db.t3.medium',
            DBClusterIdentifier: { Ref: 'DocumentDBCluster' },
        },
    },
    DocumentDBCluster: {
        Type: 'AWS::DocDB::DBCluster',
        Properties: {
            MasterUsername: 'tp',
            MasterUserPassword: 'NQ7qIwic',
            DBSubnetGroupName: { Ref: 'DbSubnetGroup' },
            AvailabilityZones: ['us-east-1a', 'us-east-1b'],
            StorageEncrypted: true,
            VpcSecurityGroupIds: [{ Ref: 'DatabaseVpcSecurityGroup' }],
        },
    },
};
