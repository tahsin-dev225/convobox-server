import status from "http-status";
import AppError from "../../errorHelpers/appError";
import { prisma } from "../../lib/prisma";
import { tokenHelpers } from "../../utils/token";
import bcrypt from "bcryptjs";
import { ILoginPayload, IRegisterUserPayload } from "./auth.interface";

const registerUser = async (payload: IRegisterUserPayload) => {
  const { name, email, password } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "User already exists with this email",
    );
  }


  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      createdAt: true,

    },
  });

  const accessToken = tokenHelpers.getAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const refreshToken = tokenHelpers.getRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return {
    user: user,
    accessToken,
    refreshToken,
  };
};

const login = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(status.UNAUTHORIZED, "Invalid password");
  }

  const accessToken = tokenHelpers.getAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const refreshToken = tokenHelpers.getRefreshToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return {
    user: user,
    accessToken,
    refreshToken,
  };
}

const allUser = async () => {
  const users = await prisma.user.findMany();
  if (!users.length) {
    throw new AppError(status.NOT_FOUND, "Users not found");
  }
  return users;
}


export const authService = {
  registerUser,
  allUser
}