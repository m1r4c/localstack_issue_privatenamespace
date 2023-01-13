import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CloudmapConstruct } from '../constructs/cloudmap.construct';
import { Stages } from '../utils/stages.enum';
import { VpcConstruct } from '../constructs/vpc.construct';
import { HelloWorldConstruct } from '../constructs/helloworld.construct';
import { ClusterConstruct } from '../constructs/cluster.construct';

interface Deployment {
    deployment: string;
    account: string;
  }
  
interface DeploymentStackProps extends StackProps {
principals: Deployment[];
}

export class DeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props: DeploymentStackProps) {
    super(scope, id, props);

    // VPC
    const vpcConstruct = new VpcConstruct(this, Stages.LOCALSTACK);

    // Cloudmap
    const cloudmap = new CloudmapConstruct(this, { vpc: vpcConstruct.vpc });

    const clusterConstruct = new ClusterConstruct(this, Stages.LOCALSTACK, { vpc: vpcConstruct.vpc });

    const helloWorldConstruct = new HelloWorldConstruct(this, 'demo', {
      cluster: clusterConstruct.cluster,
      stage: Stages.LOCALSTACK,
      vpc: vpcConstruct.vpc,
      namespace: cloudmap.namespace,
      deployment: {
        account: "000000000000",
        region: "eu-central-1"
      },
    });
  }
}