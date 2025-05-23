import {Router, Request, Response} from "express";
import { db } from "../db";
import {NewUser, users} from '../db/schema';
import {eq} from 'drizzle-orm';
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { auth, AuthRequest } from "../middleware/auth";


const authRouter = Router();

interface SignUpBody {
    name: string;
    email: string;
    password: string;
}

interface LoginBody {
    email: string;
    password: string;
}


authRouter.post("/signup", async (req : Request<{}, {}, SignUpBody>, res : Response) => {
    try {

    // get req body 
    const {name, email, password} = req.body;
    // check is the user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));

    if(existingUser.length){
        res.status(400).json({msg: "Usuário com o mesmo email já existe!"});
        return;
    }
    //hashed password
    const hashedPassword = await bcryptjs.hash(password, 8)

    //create a new user and store in db
    const newUser : NewUser = {
        name: name,
        email: email,
        password: hashedPassword,
    };
    const [user] = await db.insert(users).values(newUser).returning();
    res.status(201).json(user);
    } catch(err){
        res.status(500).json({error: err});
    }
})


authRouter.post("/login", async (req : Request<{}, {}, LoginBody>, res : Response) => {
    try {

    // get req body 
    const {email, password} = req.body;
    // check is the user already exists
    const [existingUser] = await db.select().from(users).where(eq(users.email, email));

    if(!existingUser){
        res.status(400).json({msg: "Usuário com o email não existe!"});
        return;
    }
    //hashed password
    const isMatch = await bcryptjs.compare(password, existingUser.password)
    if(!isMatch){
        res.status(400).json({msg: "Senha incorreta!"});
        return;
    }

    const token = jwt.sign({id: existingUser.id}, "passwordKey");
    res.json({token,...existingUser})

    res.json(existingUser);
    
    } catch(err){
        res.status(500).json({error: err});
    }
})

authRouter.post("/tokenIsValid", async (req, res)=> {
    try {
        const token = req.header("x-auth-token");

        if(!token) {
            res.json(false);
            return;
        }

        const verified = jwt.verify(token, "passwordKey");

        if(!verified) {
            res.json(false);
            return;
        }

        const verifiedToken = verified as {id: string};

        const user = await db.select().from(users).where(eq(users.id, verifiedToken.id));

        if(!user) {
            res.json(false);
            return;
        }
        res.json(true);
    }
    catch(err){
        res.status(500).json(false);
    }
})

authRouter.get("/", auth, async (req : AuthRequest, res) => {
    try {
        if(!req.user){
            res.status(401).json({msg: "User not found"});
            return;
        }

        const [user] = await db.select().from(users).where(eq(users.id, req.user));

        res.json({...user, token: req.token});
    } catch(err){
        res.status(500).json(false);
    }
})

export default authRouter;
