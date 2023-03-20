import dotenv from 'dotenv';
dotenv.config();
import { generateAccessToken } from './src/index';

(async () => {
  try {
    const {
      FYERS_APP_ID,
      FYERS_APP_TYPE,
      FYERS_APP_SECRET,
      REDIRECT_URL,
      FYERS_USER_ID,
      FYERS_USER_PIN,
      TOTP_SECRET_KEY,
    } = process.env;
    if (
      !FYERS_APP_ID ||
      !FYERS_APP_TYPE ||
      !FYERS_APP_SECRET ||
      !REDIRECT_URL ||
      !FYERS_USER_ID ||
      !FYERS_USER_PIN ||
      !TOTP_SECRET_KEY
    ) {
      throw new Error('All credentials not found');
    }
    const token = await generateAccessToken({
      fyersAppId: FYERS_APP_ID,
      fyersAppType: FYERS_APP_TYPE,
      fyersAppSecret: FYERS_APP_SECRET,
      fyersAppRedirectUrl: REDIRECT_URL,
      fyersUserId: FYERS_USER_ID,
      fyersUserPin: FYERS_USER_PIN,
      totpSecretKey: TOTP_SECRET_KEY,
    });
    console.log({ token });
  } catch (error) {
    console.log(error);
  }
})();
