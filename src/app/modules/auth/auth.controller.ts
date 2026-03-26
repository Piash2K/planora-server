import { Request, Response } from 'express';

import { AuthServices } from './auth.service';

const register = async (req: Request, res: Response) => {
	try {
		const result = await AuthServices.register(req.body);

		res.status(201).json({
			success: true,
			message: 'User registered successfully',
			data: result,
		});
	} catch (error: unknown) {
		res.status(400).json({
			success: false,
			message: error instanceof Error ? error.message : 'Registration failed',
		});
	}
};

export const AuthControllers = {
	register,
};
