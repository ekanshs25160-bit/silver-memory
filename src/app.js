import express from 'express'
import cors from 'cors'
import { healthCheck } from './controllers/healthCheck.controllers'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))

app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || "https://localhost:5173",
    credentials: true,
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
    }))

app.use('api/v1/healthCheck', healthCheck)

app.get('/', (req, res) => {
    res.send('This is the home page')
})

export default app
