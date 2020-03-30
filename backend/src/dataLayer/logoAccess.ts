const AWS = require("aws-sdk");
const AWSXRay = require("aws-xray-sdk");
import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { createLogger } from "../utils/logger";
import { Logo } from "../models/Logo";

const logger = createLogger("logo-access");

const XAWS = AWSXRay.captureAWS(AWS);

export class LogoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly s3 = new XAWS.S3({ signatureVersion: "v4" }),
    private readonly logosTable = process.env.LOGOS_TABLE,
    private readonly bucketName = process.env.ATTACHMENTS_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly indexName = process.env.USER_ID_INDEX
  ) {
    //
  }

  async getAllLogos(userId: string): Promise<Logo[]> {
    logger.info("Getting all logo items");

    const result = await this.docClient
      .query({
        TableName: this.logosTable,
        IndexName: this.indexName,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId
        },
        ScanIndexForward: false
      })
      .promise();

    const items = result.Items;

    return items as Logo[];
  }

  async createLogo(logo: Logo): Promise<Logo> {
    logger.info(`Creating a logo with ID ${logo.logoId}`);

    const newItem = {
      ...logo,
      attachmentUrl: `https://${this.bucketName}.s3.amazonaws.com/${logo.logoId}`
    };

    await this.docClient
      .put({
        TableName: this.logosTable,
        Item: newItem
      })
      .promise();

    return logo;
  }

  async updateLogo(logo: Logo): Promise<Logo> {
    logger.info(`Updating a logo with ID ${logo.logoId}`);

    const updateExpression = "set title = :title, description = :description";

    await this.docClient
      .update({
        TableName: this.logosTable,
        Key: {
          userId: logo.userId,
          //logoId: logo.logoId
        },
        UpdateExpression: updateExpression,
        ConditionExpression: "logoId = :logoId",
        ExpressionAttributeValues: {
          ":title": logo.title,
          ":description": logo.description,
          ":logoId": logo.logoId
        },
        ReturnValues: "UPDATED_NEW"
      })
      .promise();

    return logo;
  }

  async deleteLogo(logoId: string, userId: string): Promise<string> {
    logger.info(`Deleting a logo with ID ${logoId}`);

    await this.docClient
      .delete({
        TableName: this.logosTable,
        Key: {
          userId,
          logoId
        },
        ConditionExpression: "logoId = :logoId",
        ExpressionAttributeValues: {
          ":logoId": logoId
        }
      })
      .promise();

    return userId;
  }

  async generateUploadUrl(logoId: string): Promise<string> {
    logger.info("Generating upload Url");

    return this.s3.getSignedUrl("putObject", {
      Bucket: this.bucketName,
      Key: logoId,
      Expires: parseInt(this.urlExpiration)
    });
  }
}

const createDynamoDBClient = () => {
  if (process.env.IS_OFFLINE) {
    logger.info("Creating a local DynamoDB instance");

    return new XAWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000"
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
};
