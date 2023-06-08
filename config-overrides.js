const path = require("path");
const webpack = require("webpack");
const {getLoader, loaderNameMatches} = require("react-app-rewired");

module.exports = function override(config, env) {
    config.module.rules[1].oneOf.splice(2, 0, {
        test: /\.(less|css)$/,
        use: [
            {loader: 'style-loader'},
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    sourceMap: true,
                    modules: {mode: 'icss'}
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        ident: 'postcss',
                        config: false,
                        plugins: [
                            'tailwindcss',
                            'postcss-flexbugs-fixes',
                            [
                                'postcss-preset-env',
                                {
                                    autoprefixer: {
                                        flexbox: 'no-2009'
                                    },
                                    stage: 3
                                }
                            ]
                        ]
                    },
                    sourceMap: true
                }
            },
            {
                loader: 'less-loader',
            },
        ],
    })
    config.resolve.alias = {
        '@': path.resolve(__dirname, 'src'),
    }

    config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"]

    config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve("buffer")
    }
    config.resolve.modules = (config.resolve.modules || []).concat([
        path.resolve(__dirname, 'src'),
        'node_modules',
    ])
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
        }),
    ]
    return config;
}
