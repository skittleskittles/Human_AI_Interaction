const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: "./src/index.js",
    // feedback: "./src/feedback.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // Ensures old files are removed
    publicPath: "",
  },
  mode: "development", // production
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    hot: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: "asset/resource",
      },
    ],
  },
  optimization: {
    usedExports: true, // Removes unused functions
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html", // Generates dist/index.html
      chunks: ["main"],
      template: "./pages/index.html",
    }),
    // new HtmlWebpackPlugin({
    //   filename: "feedback.html", // Generates dist/index.html
    //   chunks: ["feedback"],
    //   template: "./pages/feedback.html",
    // }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./pages/feedback.html", to: "feedback.html" },
      ],
    }),
  ],
};
