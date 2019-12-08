const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'currency.sqlite',
});

const CurrencyShop = sequelize.import('models/CurrencyShop');
sequelize.import('models/Users');
sequelize.import('models/UserItems');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const shop = [
		CurrencyShop.upsert({ name: 'iPhone', cost: 1 }),
		CurrencyShop.upsert({ name: 'iPhone X', cost: 2 }),
		CurrencyShop.upsert({ name: 'iPhone XS', cost: 5 }),
		CurrencyShop.upsert({ name: 'iPhone XS Max', cost: 100 }),
	];
	await Promise.all(shop);
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);
