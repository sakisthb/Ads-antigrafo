declare module 'facebook-nodejs-business-sdk' {
  export const bizSdk: {
    FacebookAdsApi: {
      init: (accessToken: string) => void;
      getInstance: () => any;
    };
    AdAccount: new (id: string) => any;
    Campaign: new (id: string) => any;
    AdSet: new (id: string) => any;
    Ad: new (id: string) => any;
  };
} 