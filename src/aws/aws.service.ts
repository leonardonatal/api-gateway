import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  private logger = new Logger(AwsService.name);

  constructor(private configService: ConfigService) {}

  AWS_S3_BUCKET_NAME = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  AWS_REGION = this.configService.get<string>('AWS_REGION');
  AWS_ACCESS_KEY_ID = this.configService.get<string>('AWS_ACCESS_KEY_ID');
  AWS_SECRET_ACCESS_KEY = this.configService.get<string>(
    'AWS_SECRET_ACCESS_KEY',
  );

  public async uploadArquivo(file: any, id: string) {
    const s3 = new AWS.S3({
      region: this.AWS_REGION,
      accessKeyId: this.AWS_ACCESS_KEY_ID,
      secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
    });

    const fileExtension = file.originalname.split('.')[1];
    //recuperando extensao do arquivo
    const urlKey = `${id}.${fileExtension}`;
    this.logger.log(`urlKey: ${urlKey}`);

    const params = {
      Bucket: this.AWS_S3_BUCKET_NAME,
      Key: urlKey,
      Body: file.buffer,
    };

    const data = s3
      .putObject(params)
      .promise()
      .then(
        (data) => {
          return {
            url: `https://${this.AWS_S3_BUCKET_NAME}.${this.AWS_REGION}.amazonaws.com/${urlKey}`,
          };
        },
        (err) => {
          this.logger.error(err);
          return err;
        },
      );

    return data;
  }
}
