const path = require("path");
const webpack = require("webpack");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageMinPlugin = require("imagemin-webpack-plugin").default;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const MODULE_NAME = "dungeonesis";

module.exports = (env, argv) => {
  const distPath = MODULE_NAME + "/static/dist";
  const isProduction = argv.mode === "production";

  return {
    context: __dirname,
    entry: "./src/index",
    output: {
      path: path.resolve(__dirname, distPath),
      filename: "bundle.js",
      publicPath: "/static/dist"
    },
    devServer: {
      contentBase: MODULE_NAME,
      port: 9000,
      proxy: { "/": "http://localhost:8000" },
      hot: true
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx"],
      alias: {
        // We need the compiler + runtime version of Vue as we don't have a full
        // blown SPA on our hands here
        vue$: "vue/dist/vue.esm.js"
      }
    },
    devtool: isProduction ? "source-map" : "cheap-module-eval-source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader"
        },
        {
          test: /\.vue$/,
          loader: "vue-loader"
        },
        {
          test: /\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                minimize: isProduction
              }
            },
            "sass-loader"
          ]
        },
        {
          test: /\.(png|jpg|svg)$/,
          use: "file-loader"
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin([
        {
          from: "src/images/",
          to: "images/"
        }
      ]),
      new MiniCssExtractPlugin({
        filename: "app.css"
      }),
      new ImageMinPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
      new VueLoaderPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ]
  };
};
