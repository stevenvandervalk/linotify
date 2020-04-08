const pkg = require('./package.json');
const path = require('path');
const baseManifest = require('./public/manifest/base');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');

module.exports = {
    mode: 'development',
    watch: true,
    devtool: 'inline-source-map',

    entry: {
        content: [
            './src/content.ts',
            './src/content.scss',
        ],
        options: [
            './src/options.ts',
            './src/options.scss',
        ],
        background: './src/background.ts',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },

    plugins: [
        new webpack.ProgressPlugin(),
        new CopyPlugin([
            { from: 'public/images/linotify_icon*', to: 'assets/[name].[ext]' },
            { from: 'public/images/*.svg', to: 'assets/[name].[ext]' },
            { from: 'locales', to: '_locales/[name]/messages.json' },
            { from: 'public/fonts/*.woff', to: 'public/fonts/[name].[ext]' },
            { from: 'public/fonts/*.woff2', to: 'public/fonts/[name].[ext]' },
            { from: 'public/*.html', to: '[name].[ext]' },
        ]),
        new WebpackExtensionManifestPlugin({
            config: {
                base: baseManifest,
                extend: {
                    name: 'LiNotify - Dev Build',
                    version: pkg.version,
                    homepage_url: pkg.homepage
                }
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new IgnoreEmitPlugin([/\/style.js$/, /\/*.LICENSE$/]),
        new ExtensionReloader({
            reloadPage: false, // Force the reload of the page also
            entries: { // The entries used for the content/background scripts
                contentScript: 'content', // Use the entry names, not the file name or the path
                background: 'background' // *REQUIRED
            }
        }),
    ],

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                include: [path.resolve(__dirname, 'src')],
                exclude: [/node_modules/]
            },
            {
                test: /\.scss$/,
                include: [path.resolve(__dirname, 'src')],
                use: [MiniCssExtractPlugin.loader, 'fast-css-loader', 'fast-sass-loader'],
            },
        ]
    },

    resolve: {
        extensions: ['.ts', '.js', '.scss'],
    },
};
