import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { envVars } from '../../../config/env';

type TRegisterPayload = {
	name: string;
	email: string;
	phone?: string;
	password: string;
};

type TLoginPayload = {
	email: string;
	password: string;
};

const createUser = async (payload: TRegisterPayload) => {
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


const loginUser = async (payload: TLoginPayload) => {
	const { email, password } = payload;

	if (!email || !password) {
		throw new Error('Email and password are required');
	}

	const user = await prisma.user.findUnique({
		where: { email },
		select: {
			id: true,
			name: true,
			email: true,
			password: true,
			role: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	if (!user) {
		throw new Error('Invalid email or password');
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		throw new Error('Invalid email or password');
	}

	const token = jwt.sign(
		{ id: user.id, email: user.email, role: user.role },
		envVars.JWT_SECRET_KEY,
		{ expiresIn: '7d' },
	);

	const { password: _, ...userWithoutPassword } = user;

	return {
		token,
		user: userWithoutPassword,
	};
};

export const AuthServices = {
	createUser,
	loginUser,
};
