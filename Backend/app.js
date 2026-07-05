import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import User from "./model/user.js"
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import {generateInterviewReport,generateResumePdf} from "./aiService.js";
import InterviewReport from "./model/interviewReport.js";
import ExpressError from "./utils/ExpressError.js";
import MongoStore from "connect-mongo";


const app = express();

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 3 * 1024 * 1024 } // Limit file size to 3MB
});

const store = MongoStore.create({
    mongoUrl:process.env.MONGO_URL,
    crypto: {
        secret:process.env.SESSION_SECRET,
    },
    touchAfter:24 * 3600,
})

app.set('trust proxy', 1);

app.use(session({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie : {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",   // cookie only over HTTPS
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    }
}));

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/',(req,res)=> {
    res.send("working");
})


app.post('/api/signup',async (req,res,next)=> {
    try{
        let { username, email, password} = req.body;
        let newUser  = new User({
            email : email,
            username : username,
        });

        let user = await User.register(newUser,password);

        req.login(user,(err)=> {
            if(err) {
                return next(err);
            }
        
            res.json({ 
                success:true,
                message:"User Recieved",
            })
        })
    }
    catch(e) {
        return next(e);
    }
});


app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {

    if (err) return next(err);

    if (!user) {
      return res.status(201).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);

      return res.json({
        success: true,
        message: "Access Granted",
      });
    });

  })(req, res, next);

});


app.get('/api/auth',(req,res)=>{
  if(req.isAuthenticated()) {
    res.json({
      loggedIn:true,
      message:"authenticated",
      user:req.user,
    })
  }
  else {
    res.json({
      loggedIn:false,
      message:"unauthenticated"
    })
  }
})


app.post('/api/interview', upload.single('resume'), async (req,res,next) => {
    try {
        const resumeFile = req.file;

        const parser = new PDFParse({ data: req.file.buffer });
        const result = await parser.getText();
        const resumeText = result.text;
        await parser.destroy();

        const { selfDescription, jobDescription } = req.body;

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription,
        });

        console.log(req.user);

        const interviewReport = new InterviewReport({
            user: req.user._id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        await interviewReport.save();

        res.json({
            success: true,
            message: "Interview report generated successfully",
            data: interviewReport,
        });
    }
    catch (err) {
        next(err);
    }
});


app.get('/api/interview/:id',async (req,res,next)=> {
    try {
        let {id} = req.params;

        let interviewData = await InterviewReport.findById(id);

        res.status(200).json({
            success:true,
            reportData:interviewData,
        })
    }
    catch(err) {
        next(err);
    }
})


app.get('/api/user',async (req,res,next)=> {
    try {
        const reports = await InterviewReport.find({
        user: req.user._id,
        })
        .select("title createdAt matchScore")
        .sort({ createdAt: -1 });

        res.status(200).json({
        success: true,
        data:reports,
        });
    } catch (err) {
        next(err);
    }
});

app.post("/api/resume/pdf", async (req, res) => {
    try {
        const pdfBuffer = await generateResumePdf(req.body);

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=Resume.pdf",
        });

        res.send(pdfBuffer);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to generate PDF",
        });
    }
});


app.use((err,req,res,next) => {
    let {message,status=500} = err;

    res.status(status).json({
        success:false,
        message:message,
    });
})


const port = process.env.PORT || 8000;
app.listen(port,()=> {
    console.log(`app listen on post ${port}`);
})