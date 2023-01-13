import { App } from 'aws-cdk-lib';
import { DeploymentStack
 } from './stacks/deployment';
const app = new App();

const deploymentConfig = {
    "env": {
      "account": "000000000000",
      "region": "eu-central-1"
    },
    "principals": [
      { "deployment": "localstack", "account": "000000000000" },
    ]
  };
  


new DeploymentStack(app, 'deployment', deploymentConfig);
