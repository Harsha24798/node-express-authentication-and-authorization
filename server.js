import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import { sequelize } from './config/database.js'
import auth from './routes/auth.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: true,
  credentials: true
}))

app.use('/api/auth', auth);

await sequelize.sync()

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
