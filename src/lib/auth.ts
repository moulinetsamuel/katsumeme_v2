import bcrypt from "bcryptjs";

interface PasswordOptions {
  password: string;
  hashedPassword: string;
}
export async function verifyPassword(options: PasswordOptions) {
  const { password, hashedPassword } = options;
  return await bcrypt.compare(password, hashedPassword);
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}
