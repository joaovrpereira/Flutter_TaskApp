import {Router, Request, Response} from "express";
import { db } from "../db";
import {NewUser, users} from '../db/schema';
import {eq} from 'drizzle-orm';
import bcryptjs from "bcryptjs";


const authRouter = Router();

authRouter.get("/", (req, res) => {
    res.send("From Auth.")
})

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

    res.json(existingUser);
    
    } catch(err){
        res.status(500).json({error: err});
    }
})

export default authRouter;