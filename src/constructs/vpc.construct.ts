import { Construct } from 'constructs';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { isValidNetworkIpAddress, isValidNetworkMask } from '../validators/vpc.validator';
import { Stages } from '../utils/stages.enum';

export interface VpcProps {
  networkIpAddress?: string; // e.g. 10.0.0.0
  networkMask?: number; // e.g. 21
}

export class VpcConstruct extends Construct {
  readonly vpc: Vpc;
  readonly networkAddress: string;

  constructor(parent: Construct, stage: Stages, props?: VpcProps) {
    super(parent, `vpcConstruct-${stage}`);

    if (props?.networkIpAddress && !isValidNetworkIpAddress(props.networkIpAddress)) {
      throw new Error(`Network address given is invalid, address was: ${props.networkIpAddress}`);
    }
    if (props?.networkMask && !isValidNetworkMask(props.networkMask)) {
      throw new Error(`Network mask given is invalid, mask was: ${props.networkMask}`);
    }

    const networkIpAddress = props?.networkIpAddress || '10.0.0.0';
    const networkMask = props?.networkMask || 20;
    const subnetMask = networkMask + 4;

    this.networkAddress = `${networkIpAddress}/${networkMask}`;

    this.vpc = new Vpc(this, 'vpc', {
      cidr: this.networkAddress,
      enableDnsHostnames: true,
      enableDnsSupport: true,
      maxAzs: 100, // setting this way above maximum ensures all AZs are used
      natGateways: 1, // 1 natGateway to reduce cost,
      subnetConfiguration: [
        {
          name: 'private-',
          cidrMask: subnetMask,
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          name: 'isolated-',
          cidrMask: subnetMask,
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
        {
          name: 'public-',
          cidrMask: subnetMask,
          subnetType: SubnetType.PUBLIC,
        },
      ],
    });
  }
}
