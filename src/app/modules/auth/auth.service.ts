import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';

type TRegisterPayload = {
	name: string;
	email: string;
	phone?: string;
	password: string;
};

const createUserIntoDB = async (payload: TRegisterPayload) => {
	// Basic validation
	if (!payload.email || !payload.password || !payload.name) {
		throw new Error('Name, email, and password are required');
	}

	// Email format validation
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(payload.email)) {
		throw new Error('Invalid email format');
	}

	// Password strength validation (min 6 chars)
	if (payload.password.length < 6) {
		throw new Error('Password must be at least 6 characters');
	}

	// Check for existing user by email
	const existingUser = await prisma.user.findUnique({
		where: { email: payload.email },
	});

	if (existingUser) {
		throw new Error('User with this email already exists');
	}

	const hashPassword = await bcrypt.hash(payload.password, 8);

	const result = await prisma.user.create({
		data: {
			name: payload.name,
			email: payload.email,
			password: hashPassword,
			...(payload.phone && { phone: payload.phone }),
		},
	});

	const { password, ...rest } = result;
	return rest;
};

const register = createUserIntoDB;

export const AuthServices = {
	register,
};
