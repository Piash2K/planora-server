import cors from 'cors';
import express, { Request, Response } from 'express';

import router from './app/routes';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Planora!');
});


export default app;

