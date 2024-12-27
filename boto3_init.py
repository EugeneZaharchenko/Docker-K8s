import boto3
import json

s3 = boto3.resource('s3')
for bucket in s3.buckets.all():
    print(bucket.name)

ec2 = boto3.client('ec2')
resp = ec2.run_instances(ImageId='ami-0e54671bdf3c8ed8d',
                         InstanceType='t2.micro', MinCount=1, MaxCount=1)

# To stop a single instance
instance_id = resp['Instances'][0]['InstanceId']  # Get ID from your run_instances response
response = ec2.stop_instances(InstanceIds=[instance_id])

# To stop multiple instances
response = ec2.stop_instances(InstanceIds=['i-1234567890abcdef0', 'i-0987654321fedcba0'])