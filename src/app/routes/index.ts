import { Router } from "express";
import { authRoute } from "../module/auth/auth.route";

const router = Router();

router.use('/auth', authRoute);

export const IndexRoutes = router;