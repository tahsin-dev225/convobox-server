import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { tokenHelpers } from "../../utils/token";
import { sendResponse } from "../../shared/sendResponse";
import { Request, Response } from "express";
import { authService } from "./auth.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);
  const { accessToken, refreshToken } = result;

  tokenHelpers.setAccessTokenCookie(res, accessToken);
  tokenHelpers.setRefreshTokenCookie(res, refreshToken);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.allUser();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "All users fetched successfully",
    data: result,
  });
});


export const authController = {
  registerUser,
  getAllUsers
}