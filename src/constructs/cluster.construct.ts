import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster } from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
import { Stages } from '../utils/stages.enum';

export interface ClusterProps {
  vpc: Vpc;
}

export class ClusterConstruct extends Construct {
  readonly cluster: Cluster;

  constructor(parent: Construct, stage: Stages, props: ClusterProps) {
    super(parent, `clusterConstruct-${stage}`);

    this.cluster = new Cluster(this, 'cluster', { vpc: props.vpc });
  }
}
