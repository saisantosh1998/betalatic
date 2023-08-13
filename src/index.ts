// index.ts
import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './databases/postgres'; // Create this file
import { errorHandler } from './middlewares/error';
import config from "./config/config";
import { CartRouter } from './routes/v1/CartRoutes';
import { ItemRouter } from './routes/v1/ItemRoutes';
const app = express();
const port = config.port || 3000;

app.use(bodyParser.json());

app.use('/item', ItemRouter);
app.use('/cart', CartRouter);

app.use(errorHandler);

sequelize.sync({alter:true}).then(() => {
  console.log('Database synchronized');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
