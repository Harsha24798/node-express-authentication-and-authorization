// middlewares/auth.js
import jwt from 'jsonwebtoken'

export const protect = (req, res, next) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json({ message: 'Not authorized' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: 'Token expired or invalid' })
  }
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    next()
  }
}
