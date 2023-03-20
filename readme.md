# Fyers Access Token <img src="https://static.npmjs.com/255a118f56f5346b97e56325a1217a16.svg" width="20" height="20" />

Library for Generating Fyers Access Token with TOTP using Fyers API, written in [TypeScript](https://www.typescriptlang.org/).

## Installation

```
npm install fyers-access-token
```

## Usage

```
import { generateAccessToken } from 'fyers-access-token';


const token = await generateAccessToken({
      fyersAppId: FYERS_APP_ID,
      fyersAppType: FYERS_APP_TYPE,
      fyersAppSecret: FYERS_APP_SECRET,
      fyersAppRedirectUrl: REDIRECT_URL,
      fyersUserId: FYERS_USER_ID,
      fyersUserPin: FYERS_USER_PIN,
      totpSecretKey: TOTP_SECRET_KEY,
    });
```

## License

[MIT](./LICENSE) © [Vivek Thakur](https://github.com/vivekvt)
