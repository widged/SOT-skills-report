module.exports = {
    entry  : './script.es6.js',
    output : {
        path     : __dirname,
        filename : 'es5-script.js'
    },
    module : {
        loaders: [ 
            {  test   : /.js$/, loader : 'babel-loader' }
        ]
    }
};