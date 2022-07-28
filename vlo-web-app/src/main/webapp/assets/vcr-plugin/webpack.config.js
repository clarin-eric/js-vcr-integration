const path = require('path');

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'vcr-integration.js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'babel-loader',
                options: {
                    "presets": ["@babel/preset-env"]
                }
            }, {
                // Handlebars for templating. See https://handlebarsjs.com
                test: /\.handlebars$/,
                loader: "handlebars-loader",
                // Loading of custom helpers. See https://stackoverflow.com/a/48668117 
                options: {
                    helperDirs: path.join(__dirname, 'src/templates/helpers'),
                    precompileOptions: {
                        knownHelpersOnly: false,
                    },
                },
            }
        ]
    }
};