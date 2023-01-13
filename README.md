# localstack_issue_privatenamespace

## Prerequisites
- docker
- docker-compose
- awslocal
- nodejs

## Running

I created a simple shell script to run everything, which is started by:

`./runcdk.sh`

## The issue

This typescript stack and constructs creates a private dns namespace which in AWS will create a hosted zone as well automatically.
Localstack creates the private dns namespace which can be shown by running:

`awslocal servicediscovery list-namespaces --region eu-central-1`

But no hosted zone seems to get created which can be shown by running:

`awslocal route53 list-hosted-zones`
