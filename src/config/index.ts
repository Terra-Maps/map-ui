interface IConfig {
  maps: {
    MAP_BOX_ACCESS_TOKEN: string;
  };
  algorand: {
    TOKEN: any;
    BASE_SERVER: string;
    PORT: string;
    ALGO_CHAIN_NETWORK: string;
    OREID_APP_ID: string;
    OREID_API_KEY: string;
    ALGORAND_API_KEY: string;
    OREID_URL: string;
    INDEXER_SERVER: string;
  };
  urls: {
    BASE_URL: string;
    API_URL: string;
  };
}

const NODE_ENV: string = "development";

const development: IConfig = {
  maps: {
    MAP_BOX_ACCESS_TOKEN:
      process.env.MAP_BOX_ACCESS_TOKEN ||
      "pk.eyJ1IjoicmVrcGVybyIsImEiOiJja2ZlNW03YWcwMXBtMnJtaGFncTJqeHJ4In0.QZRVNvwQ4Nr6q2u_1cHudg",
  },
  algorand: {
    TOKEN: {
      "X-API-key": "Z35RmKIbKD2MqsQXWVEv9jP3XhJFCAR740TI1ywh",
    },
    BASE_SERVER: "https://testnet-algorand.api.purestake.io/ps2",
    PORT: "",
    ALGO_CHAIN_NETWORK: "algo_test",
    OREID_APP_ID: "t_8589b1436f21423eacaca15533370539",
    OREID_API_KEY: "t_kb2b834f55f6e4bfd82f21d1ceaff7cef",
    ALGORAND_API_KEY: "fmprdjLHAM5gfosJUVND49NtPKHEf8dz4CQu0VTY",
    OREID_URL: "http://service.oreid.io",
    INDEXER_SERVER: "https://testnet-algorand.api.purestake.io/idx2",
  },
  urls: {
    BASE_URL: process.env.BASE_URL || "http://localhost:3000",
    API_URL: process.env.API_URL || "http://localhost:5000",
  },
};

const production: IConfig = {
  maps: {
    MAP_BOX_ACCESS_TOKEN: process.env.MAP_BOX_ACCESS_TOKEN || "xxx",
  },
  algorand: {
    TOKEN: {
      "X-API-key": "Z35RmKIbKD2MqsQXWVEv9jP3XhJFCAR740TI1ywh",
    },
    BASE_SERVER: "https://testnet-algorand.api.purestake.io/ps2",
    PORT: "",
    ALGO_CHAIN_NETWORK: "algo_test",
    OREID_APP_ID: "t_8589b1436f21423eacaca15533370539",
    OREID_API_KEY: "t_kb2b834f55f6e4bfd82f21d1ceaff7cef",
    ALGORAND_API_KEY: "fmprdjLHAM5gfosJUVND49NtPKHEf8dz4CQu0VTY",
    OREID_URL: "http://service.oreid.io",
    INDEXER_SERVER: "https://testnet-algorand.api.purestake.io/idx2",
  },
  urls: {
    BASE_URL: process.env.BASE_URL || "http://localhost:3000",
    API_URL: process.env.API_URL || "http://localhost:5000",
  },
};

const test: IConfig = {
  maps: {
    MAP_BOX_ACCESS_TOKEN: process.env.MAP_BOX_ACCESS_TOKEN || "xxx",
  },
  algorand: {
    TOKEN: {
      "X-API-key": "Z35RmKIbKD2MqsQXWVEv9jP3XhJFCAR740TI1ywh",
    },
    BASE_SERVER: "https://testnet-algorand.api.purestake.io/ps2",
    PORT: "",
    ALGO_CHAIN_NETWORK: "algo_test",
    OREID_APP_ID: "t_8589b1436f21423eacaca15533370539",
    OREID_API_KEY: "t_kb2b834f55f6e4bfd82f21d1ceaff7cef",
    ALGORAND_API_KEY: "fmprdjLHAM5gfosJUVND49NtPKHEf8dz4CQu0VTY",
    OREID_URL: "http://service.oreid.io",
    INDEXER_SERVER: "https://testnet-algorand.api.purestake.io/idx2",
  },
  urls: {
    BASE_URL: process.env.BASE_URL || "http://localhost:3000",
    API_URL: process.env.API_URL || "http://localhost:5000",
  },
};

const config: {
  [name: string]: IConfig;
} = {
  test,
  development,
  production,
};

export default config[NODE_ENV];
