import { Sequelize } from 'sequelize';
import config from '../config/config';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.host,
  port: Number(config.dbPort),
  username: config.username,
  password: config.password,
  database: config.database,
  logging: false, // Disable logging SQL queries
});


export { sequelize };
