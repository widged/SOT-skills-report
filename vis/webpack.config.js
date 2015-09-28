module.exports = {
    entry  : './bundle.es6.js',
    output : {
        path     : __dirname,
        filename : 'dist/bundle.es5.js'
    },
    module : {
        loaders: [ 
            {  test   : /.js$/, loader : 'babel-loader' }
        ]
    }
};