import express, { type Application, type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { envVars } from "./config/env";
import qs from "qs";
import { IndexRoutes } from "./app/routes/index";
import { globalErrorHandler } from "./app/middlewere/globalErrorHandler";
import { notFound } from "./app/middlewere/notFound";


const app: Application = express()
app.set("query parser", (str: string) => qs.parse(str))



app.use(cors({
  origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: '10mb' }));



app.use('/api/v1', IndexRoutes)

// Basic route
app.get('/', async (req: Request, res: Response) => {

  res.send('Hello, World!');
});

app.use(globalErrorHandler)
app.use(notFound)


export default app;