import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
	PORT: string;
	DATABASE_URL: string;
	JWT_SECRET_KEY: string;
}

const loadEnvVariables = (): EnvConfig => {
	const requireEnvironmentVariables = ["PORT", "DATABASE_URL", "JWT_SECRET_KEY"];

	requireEnvironmentVariables.forEach((variable) => {
		if (!process.env[variable]) {
			throw new Error(
				`Environment variable ${variable} is required but not defined in .env file.`,
			);
		}
	});

	return {
		PORT: process.env.PORT as string,
		DATABASE_URL: process.env.DATABASE_URL as string,
		JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
	};
};

export const envVars = loadEnvVariables();

