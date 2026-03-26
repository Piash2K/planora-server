import app from './app';
import { envVars } from './config/env';

app.listen(envVars.PORT, () => {
	console.log(`🚀 Planora server running on port ${envVars.PORT}`);
});

