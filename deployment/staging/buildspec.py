import os
import subprocess
import json
import logging

logger = logging.getLogger('Deploy to Staging')

AWS_REGION = os.environ.get('AWS_REGION')
EKS_CLUSTER_NAME = os.environ.get('EKS_CLUSTER_NAME')
LOCAL_HOST = os.environ.get('LOCAL_HOST')
LOCAL_PORT = os.environ.get('LOCAL_PORT')
REMOTE_PORT = os.environ.get('REMOTE_PORT')
EKS_KUBECTL_ROLE = os.environ.get('EKS_KUBECTL_ROLE')
ROLE_SESSION_NAME = os.environ.get('ROLE_SESSION_NAME')


def get_vpc_id_and_endpoint() -> str:
  # Get eks cluster information
  logger.info('Getting eks cluster information')
  cluster_info_command = f'aws eks describe-cluster --name {EKS_CLUSTER_NAME}'
  cluster = json.loads(
      subprocess.check_output(cluster_info_command, shell=True)
  )['cluster']

  remote_host = cluster['endpoint']

  vpc_id = cluster['resourcesVpcConfig']['vpcId']
  return vpc_id, remote_host


def access_instance_and_run_tunnel(vpc_id: str, remote_host: str) -> str:
  # Get intance id through the vpcId generate in previous step
  logger.info('Getting intance id through the vpcId generate in previous step')

  describe_instance_command = f'aws ec2 describe-instances --filters Name=vpc-id,Values={vpc_id}'
  instance = json.loads(
      subprocess.check_output(describe_instance_command, shell=True)
  )['Reservations'][0]['Instances'][0]

  instance_id = instance['InstanceId']
  mssh_remote_host = remote_host.replace('https://', '')

  # Run tunnel
  mssh_command = f'mssh -o StrictHostKeyChecking=no --region {AWS_REGION} \
    -N -f -L {LOCAL_PORT}:{mssh_remote_host}:{REMOTE_PORT} ubuntu@{instance_id}'
  subprocess.run(mssh_command, shell=True)

  return mssh_remote_host


def assume_kubectl_role():
  # Assume role to run kubectl and change credentials in environment
  logger.info('Assuming role to run kubectl and change credentials in environment')

  assume_role_command = f'aws sts assume-role --role-arn {EKS_KUBECTL_ROLE} \
          --role-session-name {ROLE_SESSION_NAME} --duration-seconds 900'

  aws_credentials = json.loads(subprocess.check_output(assume_role_command, shell=True))['Credentials']

  os.environ['AWS_ACCESS_KEY_ID'] = aws_credentials['AccessKeyId']
  os.environ['AWS_SECRET_ACCESS_KEY'] =  aws_credentials['SecretAccessKey']
  os.environ['AWS_SESSION_TOKEN'] = aws_credentials['SessionToken']
  os.environ['AWS_EXPIRATION'] = aws_credentials['Expiration']


def replace_kubeconfig_server(mssh_remote_host: str):
  # Generate and Replace Server in Kubeconfig with Tunnel Port
  logger.info('Generating and Replacing Server in Kubeconfig with Tunnel Port')

  subprocess.run('rm -rf kubeconfig.yaml', shell=True)

  fetch_kubeconfig_command = f'aws eks --region {AWS_REGION} update-kubeconfig --name {EKS_CLUSTER_NAME}\
      --kubeconfig kubeconfig.yaml'

  subprocess.run(fetch_kubeconfig_command, shell=True)

  os.environ['KUBECONFIG'] = 'kubeconfig.yaml'

  with open('kubeconfig.yaml', 'r') as file :
    filedata = file.read()

  filedata = filedata.replace(f'{mssh_remote_host}', f'{LOCAL_HOST}:{LOCAL_PORT}')

  with open('kubeconfig.yaml', 'w') as file:
    file.write(filedata)


def apply_manifest_and_kill_tunnel():
  # Apply deployment manifest file
  logger.info('Applying deployment manifest file and killing tunnel')

  subprocess.run('kubectl apply -f deployment/staging/controller.yml', shell=True)

  # Kill Tunnel
  kill_command = f'ps aux | grep ssh | grep {mssh_remote_host} | grep {LOCAL_PORT} | awk \'{{print $2}} \'' \
                       ' | xargs kill -9 $1'

  subprocess.run(kill_command, shell=True)


if __name__ == '__main__':
  logger.info('Initiating deployment')
  vpc_id, remote_host = get_vpc_id_and_endpoint()
  mssh_remote_host = access_instance_and_run_tunnel(vpc_id, remote_host)
  assume_kubectl_role()
  replace_kubeconfig_server(mssh_remote_host)
  apply_manifest_and_kill_tunnel()
  logger.info('Deployment Complete')
