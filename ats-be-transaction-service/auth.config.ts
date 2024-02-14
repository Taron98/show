/** @format */
import * as express from 'express';
import { identifyTokenAndDecode, authentication, accountClient } from '@atservicesv2/common';

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[],
): Promise<void> {
  const jwtDecoded = await identifyTokenAndDecode(request, securityName);
  if (!jwtDecoded.API_ACCESS) {
    const session = await accountClient.getSessionByUserId(jwtDecoded.id);
    await authentication(request, jwtDecoded, session, scopes);
  }
}
