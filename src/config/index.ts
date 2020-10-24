interface IConfig {
  maps: {
    MAP_BOX_ACCESS_TOKEN: string;
  };
  algorand: {
    token: any;
    baseServer: string;
    port: string;
  }
}

const NODE_ENV: string = "development";

const development: IConfig = {
  maps: {
    MAP_BOX_ACCESS_TOKEN:
      process.env.MAP_BOX_ACCESS_TOKEN ||
      "pk.eyJ1IjoicmVrcGVybyIsImEiOiJja2ZlNW03YWcwMXBtMnJtaGFncTJqeHJ4In0.QZRVNvwQ4Nr6q2u_1cHudg",
  },
  algorand: {
    token: {
      'X-API-key' : 'Z35RmKIbKD2MqsQXWVEv9jP3XhJFCAR740TI1ywh',
    },
    baseServer: 'https://testnet-algorand.api.purestake.io/ps2',
    port: ''
  }
};

const production: IConfig = {
  maps: {
    MAP_BOX_ACCESS_TOKEN: process.env.MAP_BOX_ACCESS_TOKEN || "xxx",
  },
  algorand: {
    token: {
      'X-API-key' : 'Z35RmKIbKD2MqsQXWVEv9jP3XhJFCAR740TI1ywh',
    },
    baseServer: 'https://testnet-algorand.api.purestake.io/ps2',
    port: ''
  }
};

const test: IConfig = {
  maps: {
    MAP_BOX_ACCESS_TOKEN: process.env.MAP_BOX_ACCESS_TOKEN || "xxx",
  },
  algorand: {
    token: {
      'X-API-key' : 'Z35RmKIbKD2MqsQXWVEv9jP3XhJFCAR740TI1ywh',
    },
    baseServer: 'https://testnet-algorand.api.purestake.io/ps2',
    port: ''
  }
};

const config: {
  [name: string]: IConfig;
} = {
  test,
  development,
  production,
};

export default config[NODE_ENV];
