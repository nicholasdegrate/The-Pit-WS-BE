const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  app_id: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  forex_api: process.env.FOREX_API_KEY,
  db: process.env.DB
};