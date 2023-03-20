export const BASE_URL = 'https://api-t2.fyers.in/vagator/v2';

export const BASE_URL_2 = 'https://api.fyers.in/api/v2';

export const SEND_LOGIN_OTP_URL = BASE_URL + '/send_login_otp';

export const VERIFY_TOTP_URL = BASE_URL + '/verify_otp';

export const VERIFY_PIN_URL = BASE_URL + '/verify_pin';

export const TOKEN_URL = BASE_URL_2 + '/token';

export const VALIDATE_AUTH_CODE_URL = BASE_URL_2 + '/validate-authcode';

export const SUCCESS = 1;

export const ERROR = -1;

export enum STATUS {
  SUCCESS = 1,
  ERROR = -1,
}
