const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');

const entryFiles = glob.sync('./src/**/*.js')
	.map((value, index, array)=>{return '/'+value});

// const plugins = entryFiles.map((filePath) => {
// 	const entryName = path.basename(filePath, '.js');
// 	return new HtmlWebpackPlugin({
// 		filename: `${entryName}.html`, // Генерируем имя HTML-файла на основе имени .js файла
// 		template: 'src/index.html', // Ваш исходный HTML-файл
// 		chunks: [entryName], // Используем только один скрипт для каждой страницы
// 	});
// });

module.exports = {
	mode: 'none',
	entry: {
		main: entryFiles
	},
	output: {
		iife: false,
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'), // Директория для выходных файлов
		publicPath: '/',
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
	},
	// module: {
	// 	rules: [
	// 	// Ваши правила загрузки JavaScript файлов, если они нестандартные
	// 	],
	// },
	// plugins: [
	// 	new HtmlWebpackPlugin({
	// 		template: 'src/index.html', // Ваш исходный HTML-файл
	// 		filename: 'index.html', // Имя выходного HTML-файла
	// 	}),
	// ],
	// devServer: {
	// 	// Конфигурация dev-сервера, если необходимо
	// },
	// resolve: {
	// 	extensions: ['.js'],
	// },
};
