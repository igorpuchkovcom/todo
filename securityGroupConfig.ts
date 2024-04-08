export default {
    DbSubnetGroup: {
        Type: 'AWS::RDS::DBSubnetGroup',
        Properties: {
            DBSubnetGroupName: 'PrivateDbSubnet',
            DBSubnetGroupDescription: 'PrivateDbSubnet',
            SubnetIds: [{ Ref: 'Subnet1' }, { Ref: 'Subnet2' }],
        },
    },
    DatabaseVpcSecurityGroup: {
        Type: 'AWS::EC2::SecurityGroup',
        Properties: {
            GroupName: 'DBSecurityGroup',
            GroupDescription: 'Allow local access',
            SecurityGroupIngress: {
                CidrIp: '10.0.0.0/16',
                IpProtocol: 'tcp',
                FromPort: '27017',
                ToPort: '27017',
            },
            VpcId: { Ref: 'VPC' },
        },
    },
};
