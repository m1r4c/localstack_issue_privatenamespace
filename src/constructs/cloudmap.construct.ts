import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DnsRecordType, PrivateDnsNamespace } from 'aws-cdk-lib/aws-servicediscovery';

export interface CloudmapProps {
  vpc: Vpc;
}

export class CloudmapConstruct extends Construct {
  readonly namespace: PrivateDnsNamespace;

  constructor(parent: Construct, props: CloudmapProps) {
    super(parent, `cloudmapConstruct-localstack`);

    this.namespace = new PrivateDnsNamespace(this, `private-dnsNamespace-localstack`, {
      name: `elpr-localstack.internal`,
      vpc: props.vpc,
    });
  }

  addDnsService(serviceName: string, cname: string): void {
    this.namespace
      .createService(serviceName, {
        dnsRecordType: DnsRecordType.CNAME,
        dnsTtl: Duration.seconds(30),
        name: serviceName,
      })
      .registerCnameInstance(serviceName, {
        instanceCname: cname,
      });
  }
}
