interface IConfig {
  maps: {
    MAP_BOX_ACCESS_TOKEN: string;
  };
}

const NODE_ENV: string = "development";

const development: IConfig = {
  maps: {
    MAP_BOX_ACCESS_TOKEN:
      process.env.MAP_BOX_ACCESS_TOKEN ||
      "pk.eyJ1IjoicmVrcGVybyIsImEiOiJja2ZlNW03YWcwMXBtMnJtaGFncTJqeHJ4In0.QZRVNvwQ4Nr6q2u_1cHudg",
  },
};

const production: IConfig = {
  maps: {
    MAP_BOX_ACCESS_TOKEN: process.env.MAP_BOX_ACCESS_TOKEN || "xxx",
  },
};

const test: IConfig = {
  maps: {
    MAP_BOX_ACCESS_TOKEN: process.env.MAP_BOX_ACCESS_TOKEN || "xxx",
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
