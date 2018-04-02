const env = process.env.NODE_ENV || 'development';
console.log('env *****', env);

if (env === 'development') {
	process.env.DB = 'its';
} else if (env === 'test') {
	process.env.DB = 'its_test';
}
