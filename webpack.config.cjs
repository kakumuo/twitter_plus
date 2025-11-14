const path = require('path')

module.exports = {
	mode: 'production', 
	entry: {
		content_script: './src/index.tsx', 
		background: './src/background.ts'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.(tsx?)$/,
				use: 'ts-loader', 
				exclude: '/node_modules/'
			}, 
			{
				test: /\.(jsx?)$/,
				use: 'babel-loader', 
				exclude: '/node_modules/'
			}
		]
	}, 
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	}
};