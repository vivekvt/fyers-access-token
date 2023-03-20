import { getTotp, verifyTotp } from './totp';
import { sendLoginOtp } from './login-otp';
import { STATUS } from './endpoints';
import { verifyPin } from './verify-pin';
import { getAuthCode, validateAuthCode } from './auth-code';

type Payload = {
  fyersAppId: string;
  fyersAppType: string;
  fyersAppSecret: string;
  fyersAppRedirectUrl: string;
  fyersUserId: string;
  fyersUserPin: string;
  totpSecretKey: string;
};

export const generateAccessToken = async (
  credentials: Payload
): Promise<string> => {
  if (
    !credentials?.fyersAppId ||
    !credentials?.fyersAppType ||
    !credentials?.fyersAppSecret ||
    !credentials?.fyersAppRedirectUrl ||
    !credentials?.fyersUserId ||
    !credentials?.fyersUserPin ||
    !credentials?.totpSecretKey
  ) {
    throw new Error(
      'All required credentials are not passed to generateAccessToken function'
    );
  }

  const sendLoginOtpResult = await sendLoginOtp({
    fyersAppId: credentials?.fyersAppId,
    fyersUserId: credentials?.fyersUserId,
  });
  if (sendLoginOtpResult[0] !== STATUS.SUCCESS) {
    throw sendLoginOtpResult[1];
  }
  const verifyTotpRequestKey = sendLoginOtpResult[1];

  let verifyTotpResult:
    | [STATUS.SUCCESS, string]
    | [STATUS.ERROR, Error]
    | undefined;
  let verifyTotpCount = 0;
  while (verifyTotpCount < 3 && verifyTotpResult?.[0] !== STATUS.SUCCESS) {
    verifyTotpCount++;
    const totp = getTotp(credentials.totpSecretKey);
    verifyTotpResult = await verifyTotp(verifyTotpRequestKey, totp);
  }
  if (verifyTotpResult?.[0] !== STATUS.SUCCESS) {
    throw verifyTotpResult?.[1];
  }
  const verifyPinRequestKey = verifyTotpResult[1];

  const verifyPinResult = await verifyPin(
    verifyPinRequestKey,
    credentials.fyersUserPin
  );
  if (verifyPinResult[0] !== STATUS.SUCCESS) {
    throw verifyPinResult[1];
  }

  const getAuthCodeResult = await getAuthCode(verifyPinResult[1], {
    fyersAppId: credentials.fyersAppId,
    fyersAppType: credentials.fyersAppType,
    fyersAppRedirectUrl: credentials.fyersAppRedirectUrl,
    fyersUserId: credentials.fyersUserId,
  });
  if (getAuthCodeResult[0] !== STATUS.SUCCESS) {
    throw getAuthCodeResult[1];
  }
  const authCode = getAuthCodeResult[1];

  const validateAuthCodeResult = await validateAuthCode(authCode, {
    fyersAppId: credentials.fyersAppId,
    fyersAppType: credentials.fyersAppType,
    fyersAppSecret: credentials.fyersAppSecret,
  });
  if (validateAuthCodeResult[0] !== STATUS.SUCCESS) {
    throw validateAuthCodeResult[1];
  }
  const accessToken = validateAuthCodeResult[1];

  return accessToken;
};
