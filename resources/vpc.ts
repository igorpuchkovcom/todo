export default {
    VPC: {
        Type: 'AWS::EC2::VPC',
        Properties: {
            CidrBlock: '10.0.0.0/16',
            InstanceTenancy: 'default',
        },
    },
    Subnet1: {
        Type: 'AWS::EC2::Subnet',
        Properties: {
            AvailabilityZone: 'us-east-1a',
            CidrBlock: '10.0.64.0/18',
            VpcId: { Ref: 'VPC' },
        },
    },
    Subnet2: {
        Type: 'AWS::EC2::Subnet',
        Properties: {
            AvailabilityZone: 'us-east-1b',
            CidrBlock: '10.0.128.0/18',
            VpcId: { Ref: 'VPC' },
        },
    },
};
