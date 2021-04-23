module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      "^/api": {
        target: "http://192.168.100.99:3001",
      },
      "^/update": {
        target: "http://192.168.100.99:3001",
      },
    },
  },
};
