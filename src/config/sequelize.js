import Sequelize from 'sequelize';

require('dotenv').config();

const defaultDbConn = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD
};

const testDbConn = {
  host: process.env.TEST_DB_HOST,
  user: process.env.TEST_DB_USER,
  database: process.env.TEST_DB_DATABASE,
  password: process.env.TEST_DB_PASSWORD
};

const conn = process.env.NODE_ENV === 'test' ? testDbConn : defaultDbConn;

const sequelize = new Sequelize(conn.database, conn.user, conn.password, {
  host: conn.host,
  dialect: process.env.DIALECT /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
  logging: false
});

export default sequelize;
