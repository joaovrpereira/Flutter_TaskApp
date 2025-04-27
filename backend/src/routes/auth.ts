import {Router} from "express";

const authRouter = Router();

authRouter.get("/", (req, res) => {
    res.send("From Auth.")
})

export default authRouter;