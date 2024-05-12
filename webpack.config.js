const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/js/canvas.js",
  output: {
    path: __dirname + "/docs/",
    filename: "./js/canvas.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.(mp3|wav)$/i,
        include: path.resolve(__dirname, "src/audio"),
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new BrowserSyncPlugin({
      host: "localhost",
      port: 3000,
      server: { baseDir: ["docs"] },
      files: ["./docs/*"],
      notify: false,
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      favicon: "favicon.ico",
      audio: "audio",
      template: "src/index.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "src/audio", to: "audio" }],
    }),
  ],
  watch: true,
  devtool: "source-map",
};
