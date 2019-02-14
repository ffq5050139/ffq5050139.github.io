const path = require("path");

module.exports = {
	entry: {
		main: path.resolve(__dirname, "./index.js")
	},
	output: {
		library: "index",
		libraryTarget: "umd",
		filename: "index.min.js",
		path: path.resolve(__dirname, "dist"),
	},
	mode: "development",
	devtool: "source-map",
	module: {
		rules: [{
			test: /\.js$/,
			use: ["source-map-loader"],
			enforce: "pre"
		}]
	}
};