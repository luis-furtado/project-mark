import express from 'express';
import bodyParser from 'body-parser';
import { errorHandler } from './middleware/error-handler';
import { registerRoutes } from './routes';

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

registerRoutes(app);
app.use(errorHandler);

app.get('/status', (_, res) => {
  res.send('Knowledge Base API is running.');
});

export default app;