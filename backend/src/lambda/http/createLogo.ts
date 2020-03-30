import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { SaveLogoRequest } from "../../requests/SaveLogoRequest";
import { createLogo } from "../../businessLogic/logos";
import { getToken } from "../../auth/utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("create-logo");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const newLogo: SaveLogoRequest = JSON.parse(event.body);
      const jwtToken: string = getToken(event.headers.Authorization);

      const newItem = await createLogo(newLogo, jwtToken);

      return {
        statusCode: 201,
        body: JSON.stringify({
          newItem
        })
      };
    } catch (e) {
      logger.error("Error: " + e.message);

      return {
        statusCode: 500,
        body: e.message
      };
    }
  }
);

handler.use(
  cors({
    credentials: true
  })
);
