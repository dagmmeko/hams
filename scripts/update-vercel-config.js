import fs from 'node:fs';

const config_file = '.vercel/output/config.json';
const config = JSON.parse(fs.readFileSync(config_file, 'utf8'));

config.crons = [
	{
		path: '/api/attendance',
		schedule: '19 12 * * *'
	}
];

fs.writeFileSync(config_file, JSON.stringify(config, null, '\t'));
