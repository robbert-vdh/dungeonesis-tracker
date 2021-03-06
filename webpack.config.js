const path = require("path");
const webpack = require("webpack");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageMinPlugin = require("imagemin-webpack-plugin").default;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
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
      extensions: [".js", ".ts", ".tsx"]
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
          test: /\.s?css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.md$/,
          use: ["html-loader", "markdown-loader"]
        },
        {
          test: /\.(png|jpg|svg|woff|ttf)$/,
          use: {
            loader: "url-loader",
            options: {
              limit: 8192
            }
          }
        }
      ]
    },
    optimization: {
      minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin({})]
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
      new webpack.DefinePlugin({
        CURRENT_VERSION: JSON.stringify(require("./package.json")["version"])
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  };
};
