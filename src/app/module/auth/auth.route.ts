import { Router } from "express";
import { authController } from "./auth.controller";


const router = Router();

router.post('/register', authController.registerUser);

router.get('/all-users', authController.getAllUsers)



export const authRoute = router;
