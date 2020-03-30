import * as uuid from "uuid";

import { Logo } from "../models/Logo";
import { LogoAccess } from "../dataLayer/logoAccess";
import { SaveLogoRequest } from "../requests/SaveLogoRequest";
import { parseUserId } from "../auth/utils";
import { createLogger } from "../utils/logger";

const logoAccess = new LogoAccess();

const logger = createLogger("logos");

export const getAllLogos = async (jwtToken: string): Promise<Logo[]> => {
  logger.info("In getAllLogos() function");

  const userId = parseUserId(jwtToken);

  return await logoAccess.getAllLogos(userId);
};

export const createLogo = async (
  saveLogoRequest: SaveLogoRequest,
  jwtToken: string
): Promise<Logo> => {
  logger.info("In createLogo() function");

  const itemId = uuid.v4();
  const userId = parseUserId(jwtToken);

  return await logoAccess.createLogo({
    logoId: itemId,
    userId,
    title: saveLogoRequest.title,
    description: saveLogoRequest.description,
    createdAt: new Date().toISOString()
  });
};

export const updateLogo = async (
  logoId: string,
  saveLogoRequest: SaveLogoRequest,
  jwtToken: string
): Promise<Logo> => {
  logger.info("In updateLogo() function");

  const userId = parseUserId(jwtToken);
  logger.info("User Id: " + userId);

  return await logoAccess.updateLogo({
    logoId,
    userId,
    title: saveLogoRequest.title,
    description: saveLogoRequest.description
  });
};

export const deleteLogo = async (
  logoId: string,
  jwtToken: string
): Promise<string> => {
  logger.info("In deleteLogo() function");

  const userId = parseUserId(jwtToken);
  logger.info("User Id: " + userId);

  return await logoAccess.deleteLogo(logoId, userId);
};

export const generateUploadUrl = async (logoId: string): Promise<string> => {
  logger.info("In generateUploadUrl() function");

  return await logoAccess.generateUploadUrl(logoId);
};
