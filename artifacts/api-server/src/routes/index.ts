import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import coursesRouter from "./courses";
import lessonsRouter from "./lessons";
import quizzesRouter from "./quizzes";
import usersRouter from "./users";
import subscriptionsRouter from "./subscriptions";
import leaderboardRouter from "./leaderboard";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(coursesRouter);
router.use(lessonsRouter);
router.use(quizzesRouter);
router.use(usersRouter);
router.use(subscriptionsRouter);
router.use(leaderboardRouter);
router.use(adminRouter);

export default router;
