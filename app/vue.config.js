const path = require('path');

module.exports = {
  configureWebpack: {
    devtool: 'cheap-eval-source-map',
    resolve: {
      alias: {
        "@views": path.join(__dirname, 'src', 'views'),
        "@store": path.join(__dirname, 'src', 'store'),
        '@global-components': path.join(__dirname, 'src', 'components', 'global'),
        '@css': path.join(__dirname, 'src', 'assets', 'css'),
        '@lib': path.join(__dirname, 'src', 'lib')
      }
    }
  },
  pluginOptions: {
    express: {
      shouldServeApp: true,
      serverDir: './srv'
    }
  }
}
