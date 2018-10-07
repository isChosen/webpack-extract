/**
 * @date 2018-9-30
 * @description development configuration
 */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: 'production', // development production
  entry: './src/components/index.js',
  output: {
    filename: 'js/[name].bundle.js',
    chunkFilename: 'js/[name].[hash:6].js',
    path: path.resolve(__dirname, 'dist'), // 打包后的目录，必须是绝对路径
    publicPath: '/' // 默认是 '/', 但现在静态资源地址是 dist
  },
  optimization: {
    splitChunks: {
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
          chunks: 'initial'
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
        },
        commons: {
          name: 'chunk-commons',
          test: path.resolve(__dirname, 'src/components'),
          priority: 12,
          minChunks: 2,
          chunks: 'async',
          reuseExistingChunk: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
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
          },
          { // 压缩图片
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              webp: {quality: 75}
          }
          }
        ]
      }
    ]
  },

  devServer: {
    open: true,
    port: '8050',
    hot: true,
    https: false,
    publicPath: '/',
    contentBase: path.resolve(__dirname, 'dist'),
    host: 'localhost',
    disableHostCheck: true,
    historyApiFallback: true
  },

  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
    extensions: ['.js', '.jsx', '.es6']
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // 只压缩分离出来的 css
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        discardComments: {removeAll: true}
      },
      canPrint: true // 是否将插件信息打印到控制台
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/id[id]hash[hash:6].css', // 供应商(vendor)样式文件
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'Oh-2',
      favicon: __dirname + '/src/favicon.ico',
      template: __dirname + '/template/index.html'
    }),
    new CleanWebpackPlugin(['dist']),
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
    ]),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map',
      // exclude: /^chunk-(antd|echarts|react).+\.js$/i
      include: ['js/main.bundle.js']
    })
  ]
}
