import axios from 'axios';
import { SEND_LOGIN_OTP_URL, STATUS } from './endpoints';

type SendLoginOtpPayload = {
  fyersUserId: string;
  fyersAppId: string;
};

export const sendLoginOtp = async ({
  fyersAppId,
  fyersUserId,
}: SendLoginOtpPayload): Promise<
  [STATUS.SUCCESS, string] | [STATUS.ERROR, Error]
> => {
  try {
    const payload = {
      app_id: fyersAppId,
      fy_id: fyersUserId,
    };
    const { data } = await axios.post(SEND_LOGIN_OTP_URL, payload);
    if (data.s === 'ok') {
      return [STATUS.SUCCESS, data?.request_key];
    }
    throw new Error('sendLoginOtp Failed');
  } catch (error) {
    return [STATUS.ERROR, error as Error];
  }
};
