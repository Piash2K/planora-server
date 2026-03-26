import dotenv from 'dotenv';

dotenv.config();

export const envVars = {
	NODE_ENV: process.env.NODE_ENV ?? 'development',
	PORT: Number(process.env.PORT) || 5000,
	DATABASE_URL: process.env.DATABASE_URL ?? '',
};

