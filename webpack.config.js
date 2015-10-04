module.exports = {
    entry  : './src/bundle.es6.js',
    output : {
        path     : __dirname,
        filename : 'staging/bundle.es5.js'
    },
    module : {
        loaders: [ 
            {  test   : /.js$/, loader : 'babel-loader' }
        ]
    }
};