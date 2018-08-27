const path = require('path')

module.exports = {
    entry: './src/js/main/renderer.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'src', 'js', 'main')
    },
    mode: 'production'
}
