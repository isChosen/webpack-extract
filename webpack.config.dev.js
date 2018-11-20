const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/components/index.jsx',
  output: {
    filename: 'js/[name].bundle[hash:6].js',
    chunkFilename: 'js/[name].bundle[chunkhash:6].js',
    path: path.resolve(__dirname, 'dist'), // 打包后的目录，必须是绝对路径
    publicPath: '/' // 默认是 '/', 但现在静态资源地址是 dist
  },
  optimization: {
    splitChunks: {
      name: true,
      chunks: 'all',
      maxAsyncRequests: 15,
      maxInitialRequests: 10,
      automaticNameDelimiter: '-',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/i,
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        },
        echarts: {
          name: 'chunk-echarts',
          test: /[\\/]node_modules[\\/]echarts[\\/]/i,
          priority: 15, // 权重要大于 libs 和 main, 不然会被打包进 libs 或 main
          chunks: 'async'
        },
        antDesign: {
          name: 'chunk-antd',
          test: /[\\/]node_modules[\\/]antd[\\/]/i,
          priority: 20,
          chunks: 'initial'
        },
        lodash: {
          name: 'chunk-lodash',
          test: /[\\/]node_modules[\\/]lodash[\\/]/i,
          priority: 25,
          chunks: 'initial'
        },
        react: {
          name: 'chunk-react',
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/i,
          priority: 30, // 权重要大于 libs 和 main, 不然会被打包进 libs 或 main
          chunks: 'initial'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|es6)$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      },
      /* node_modules 样式不需要模块化 */
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'node_modules')],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        include: [path.resolve(__dirname, 'node_modules')],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      /* 非 node_modules 样式模块化 */
      {
        test: /\.css$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[local]-[hash:base64:4]'
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
              localIdentName: '[local]-[hash:base64:4]'
            }
          },
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: 'file-loader',
              limit: 8192,
              name: '[name][hash:4].[ext]',
              outputPath: 'images/'
            }
          }
        ]
      }
    ]
  },

  devServer: {
    hot: true,
    open: true,
    https: false,
    port: '8050',
    publicPath: '/',
    host: 'localhost',
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'dist')
  },

  // 模块路径解析配置
  resolve: {
    // 配置webpack去哪些目录下寻找第三方模块, 默认只会去 node_modules 目录下寻找. 推荐绝对路径
    modules: [path.resolve(__dirname, 'node_modules')],
    extensions: ['.js', '.jsx', '.es6'],
    mainFields: ['main']
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热模块替换
    new MiniCssExtractPlugin({
      filename: 'css/[name][contenthash:6].css',
      chunkFilename: 'css/[name][contenthash:6].css', // 供应商(vendor)样式文件
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'webpack-split',
      favicon: __dirname + '/favicon.ico',
      template: __dirname + '/index.html'
    }),
    new CleanWebpackPlugin([]),
    new CopyWebpackPlugin([
      {
        from: 'src/fonts/',
        to: 'fonts/[name].[ext]',
        toType: 'template'
      },
      {
        from: 'src/css/',
        to: 'css/[name].[ext]',
        toType: 'template'
      }
    ])
  ]
}
