import axios from 'axios';
import totpGenerator from 'totp-generator';
import { VERIFY_TOTP_URL, STATUS } from './endpoints';

export const getTotp = (totpSecretKey: string) => {
  const totp = totpGenerator(totpSecretKey);
  return totp;
};

export const verifyTotp = async (
  requestKey: string,
  totp: string
): Promise<[STATUS.SUCCESS, string] | [STATUS.ERROR, Error]> => {
  try {
    const payload = {
      request_key: requestKey,
      otp: totp,
    };
    const { data } = await axios.post(VERIFY_TOTP_URL, payload);
    if (data.s === 'ok') {
      return [STATUS.SUCCESS, data?.request_key];
    }
    throw new Error(`verifyTotp Failed`);
  } catch (error) {
    return [STATUS.ERROR, error as Error];
  }
};
