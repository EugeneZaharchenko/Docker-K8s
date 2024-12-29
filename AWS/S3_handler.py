import os
import boto3
from pathlib import Path
from dotenv import load_dotenv
from botocore.exceptions import ClientError


# Load environment variables from .env file
load_dotenv()

# Initialize S3 client
s3 = boto3.client('s3')

# Define paths and names
S3_FOLDER = 'photos'
# Get values from environment variables
bucket_name = os.getenv('AWS_BUCKET_NAME')
local_file = os.getenv('LOCAL_FILE_PATH')

if not bucket_name or not local_file:
    raise ValueError("Missing required environment variables. Please set AWS_BUCKET_NAME and "
                     "LOCAL_FILE_PATH")


def upload_file_to_s3():
    # Get just the filename from the full path
    file_name = Path(local_file).name

    # Create the full S3 path (folder + filename)
    s3_path = f'{S3_FOLDER}/{file_name}'

    try:
        # Upload file
        s3.upload_file(local_file, bucket_name, S3_FOLDER)
        print(f"Successfully uploaded {local_file} to {bucket_name}/{S3_FOLDER}")
    except Exception as e:
        print(f"Error uploading file: {str(e)}")


def delete_s3_contents_and_bucket():

    try:
        # List and delete all objects in the photos folder
        response = s3.list_objects_v2(Bucket=bucket_name, Prefix=S3_FOLDER)

        if 'Contents' in response:
            for obj in response['Contents']:
                print(f"Deleting file: {obj['Key']}")
                s3.delete_object(Bucket=bucket_name, Key=obj['Key'])

            print(f"All files in {S3_FOLDER}/ have been deleted")
        else:
            print(f"No files found in {S3_FOLDER}/")

        # Delete the folder itself (in S3, folders are just prefixes)
        s3.delete_object(Bucket=bucket_name, Key=S3_FOLDER + '/')
        print(f"Folder {S3_FOLDER}/ has been deleted")

        # Delete the bucket
        s3.delete_bucket(Bucket=bucket_name)
        print(f"Bucket {bucket_name} has been deleted")

    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code')
        if error_code == 'NoSuchBucket':
            print(f"Bucket {bucket_name} does not exist")
        elif error_code == 'BucketNotEmpty':
            print(f"Bucket {bucket_name} is not empty. Please delete all contents first")
        else:
            print(f"Error: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")


if __name__ == "__main__":
    delete_s3_contents_and_bucket()
