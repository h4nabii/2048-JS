const {merge} = require("webpack-merge");
const common = require("./webpack.common");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    optimization: {
        runtimeChunk: "single",
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    toplevel: true,
                    ie8: true,
                    safari10: true,
                },
            }),
        ],
    },
});
