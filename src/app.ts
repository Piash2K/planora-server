import cors from 'cors';
import express from 'express';

import router from './app/routes';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/', (_req, res) => {
	res.status(200).json({
		success: true,
		message: 'Planora backend is ready',
	});
});

app.use('/api/v1', router);

export default app;

