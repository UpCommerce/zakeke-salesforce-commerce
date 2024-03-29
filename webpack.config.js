var path = require('path');

var webpack = require('sgmf-scripts').webpack;
var ExtractTextPlugin = require('sgmf-scripts')['extract-text-webpack-plugin'];
var sgmfScripts = require('sgmf-scripts');



module.exports = [
	{
		mode: 'none',
		name: 'js',
		entry: sgmfScripts.createJsPath(),
		output: {
			path: path.resolve('./cartridges/int_zakeke_sfra/cartridge/static'),
			filename: '[name].js'
		},
		plugins: [
			new ExtractTextPlugin({ filename: '[name].js' })
		]
	},
	{
		mode: 'none',
		name: 'scss',
		entry: sgmfScripts.createScssPath(),
		output: {
			path: path.resolve('./cartridges/int_zakeke_sfra/cartridge/static'),
			filename: '[name].css'
		},
		module: {
			rules: [{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					use: [{
						loader: 'css-loader',
						options: {
							url: false,
							minimize: true
						}
					}, {
						loader: 'postcss-loader',
						options: {
							plugins: [
								require('autoprefixer')()
							]
						}
					}, {
						loader: 'sass-loader',
						options: {
							includePaths: [
								path.resolve(process.cwd(), './node_modules/'),
							]
						}
					}]
				})
			}]
		},
		plugins: [
			new ExtractTextPlugin({ filename: '[name].css' })
		]
	}
];


