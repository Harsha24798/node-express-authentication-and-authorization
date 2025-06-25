// utils/generateJwtToken.js
import jwt from 'jsonwebtoken'

export const generateJwtTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  )

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )

  return { accessToken, refreshToken }
}
