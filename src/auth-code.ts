import axios from 'axios';
import { parse } from 'query-string';
import crypto from 'crypto';
import { STATUS, TOKEN_URL, VALIDATE_AUTH_CODE_URL } from './endpoints';

type Credentials = {
  fyersUserId: string;
  fyersAppId: string;
  fyersAppRedirectUrl: string;
  fyersAppType: string;
};

export const getAuthCode = async (
  accessToken: string,
  credentials: Credentials
): Promise<[STATUS.SUCCESS, string] | [STATUS.ERROR, Error]> => {
  try {
    const payload = {
      fyers_id: credentials.fyersUserId,
      app_id: credentials.fyersAppId,
      redirect_uri: credentials.fyersAppRedirectUrl,
      appType: credentials.fyersAppType,
      code_challenge: '',
      state: 'None',
      scope: '',
      nonce: '',
      response_type: 'code',
      create_cookie: true,
    };
    const config = {
      headers: { authorization: `Bearer ${accessToken}` },
    };
    await axios.post(TOKEN_URL, payload, config);
    throw new Error('getAuthCode failed');
  } catch (error: any) {
    if (error?.response?.data?.code === 308) {
      const parsed = parse(error?.response?.data?.Url);
      if (typeof parsed?.auth_code === 'string') {
        return [STATUS.SUCCESS, parsed?.auth_code];
      }
    }
    return [STATUS.ERROR, error as Error];
  }
};

type ValidateAuthCodeCredentials = {
  fyersAppId: string;
  fyersAppType: string;
  fyersAppSecret: string;
};

export const validateAuthCode = async (
  authCode: string,
  credentials: ValidateAuthCodeCredentials
): Promise<[STATUS.SUCCESS, string] | [STATUS.ERROR, Error]> => {
  try {
    const appIdHash = crypto
      .createHash('sha256')
      .update(
        `${credentials.fyersAppId}-${credentials.fyersAppType}:${credentials.fyersAppSecret}`
      )
      .digest('hex');
    const { data } = await axios.post(VALIDATE_AUTH_CODE_URL, {
      grant_type: 'authorization_code',
      code: authCode,
      appIdHash,
    });
    if (data?.s === 'ok') {
      return [STATUS.SUCCESS, data.access_token];
    }
    throw new Error('getAccessToken failed');
  } catch (error) {
    return [STATUS.ERROR, error as Error];
  }
};
