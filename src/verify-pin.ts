import axios from 'axios';
import { ERROR, SUCCESS, VERIFY_PIN_URL } from './endpoints';

export const verifyPin = async (requestKey2: string, fyersUserPin: string) => {
  try {
    const payload = {
      request_key: requestKey2,
      identity_type: 'pin',
      identifier: fyersUserPin,
      recaptcha_token: '',
    };
    const { data } = await axios.post(VERIFY_PIN_URL, payload);
    if (data.s === 'ok') {
      return [SUCCESS, data?.data?.access_token];
    }
    throw new Error('verifyPin Failed');
  } catch (error) {
    return [ERROR, error];
  }
};
