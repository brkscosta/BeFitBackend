import express from 'express';
import sanitizedConfig from './app/config';
import Database from './app/database';
import routes from './routes';

const app = express();
const port = sanitizedConfig.PORT;
const database = new Database();
database.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
