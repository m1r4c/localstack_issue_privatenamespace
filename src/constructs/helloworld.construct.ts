import { SubnetType, Vpc, SecurityGroup, Peer, Port } from 'aws-cdk-lib/aws-ec2';
import { AwsLogDriver, Cluster, ContainerImage, FargateService, FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { Duration, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Stages } from '../utils/stages.enum';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { IPrivateDnsNamespace } from 'aws-cdk-lib/aws-servicediscovery';

export interface HelloWorldProps {
  stage: Stages;
  cluster: Cluster;
  vpc: Vpc;
  memory?: number;
  cpu?: number;
  desiredcount?: number;
  namespace: IPrivateDnsNamespace;
  deployment: {
    region: string;
    account: string;
  };
}

export class HelloWorldConstruct extends Construct {
  readonly service: FargateService;

  constructor(parent: Construct, name: string, props: HelloWorldProps) {
    super(parent, `hellowWorldConstruct-${props.stage}-${name}`);

    const region = Stack.of(this).region;
    const account = Stack.of(this).account;

    const helloWorldRole = new Role(this, `${props.stage}-helloworld-role`, {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
      roleName: `${props.stage}-helloworld-task-role`,
    });

    const helloWorldTaskDef = new FargateTaskDefinition(this, 'task-definition', {
      cpu: props.cpu,
      memoryLimitMiB: props.memory,
      taskRole: helloWorldRole,
    });
    helloWorldTaskDef.addContainer('helloworld', {
      image: ContainerImage.fromRegistry("yeasy/simple-web:latest"),
      portMappings: [{ containerPort: 80 }],
      logging: new AwsLogDriver({
        streamPrefix: 'helloworld',
      }),
      healthCheck: {
        command: ['true'],
        interval: Duration.seconds(5),
        startPeriod: Duration.seconds(5),
      },
    });

    const helloWorldSecurityGroup = new SecurityGroup(this, `helloworld-${props.stage}-${name}-security-group`, {
        vpc: props.vpc,
        allowAllOutbound: true,
        description: 'security group for hello world'
    });
    helloWorldSecurityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(80),
      'allow port 80 from any ipv4'
    );
    helloWorldSecurityGroup.addIngressRule(
      Peer.anyIpv6(),
      Port.tcp(80),
      'allow port 80 from any ipv6'
    );

    this.service = new FargateService(this, 'helloworld', {
      cluster: props.cluster,
      taskDefinition: helloWorldTaskDef,
      cloudMapOptions: {
        cloudMapNamespace: props.namespace,
        name: 'helloworld',
      },
      assignPublicIp: false,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [helloWorldSecurityGroup]
    });
  }
}
