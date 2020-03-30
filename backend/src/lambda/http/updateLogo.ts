import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { SaveLogoRequest } from "../../requests/SaveLogoRequest";
import { updateLogo } from "../../businessLogic/logos";
import { getToken } from "../../auth/utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("update-logo");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const logoId = event.pathParameters.logoId;
      const updatedLogo: SaveLogoRequest = JSON.parse(event.body);

      const jwtToken: string = getToken(event.headers.Authorization);

      await updateLogo(logoId, updatedLogo, jwtToken);

      return {
        statusCode: 200,
        body: ""
      };
    } catch (e) {
      logger.error("Error", { error: e.message });

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
