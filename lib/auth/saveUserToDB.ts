// lib/auth/saveUserToDB.ts
import connect from '../db';
import User from '../models/User';

export const saveUserToDB = async (clerkUser: {
  id: string;
  email: string;
  name?: string;
}) => {
  await connect();

  const existingUser = await User.findOne({ clerkId: clerkUser.id });
  if (!existingUser) {
    await User.create({
      clerkId: clerkUser.id,
      email: clerkUser.email,
      name: clerkUser.name || '',
    });
  }
};
