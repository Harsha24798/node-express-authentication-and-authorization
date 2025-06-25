// controllers/authController.js
import { User } from '../models/User.js'
import { generateJwtTokens } from '../utils/generateJwtToken.js'

export const register = async (req, res) => {
  const { username, email, password, role } = req.body

  try {
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) return res.status(400).json({ message: 'Email already in use' })

    const newUser = await User.create({ username, email, password, role })
    return res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.scope(null).findOne({ where: { email } })
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' })

    const { accessToken, refreshToken } = generateJwtTokens(user)

    await User.update({ refreshToken }, { where: { id: user.id } })

    res.cookie('accessToken', accessToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', maxAge: 5 * 60 * 1000
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({ message: 'Logged in successfully', user: { id: user.id, username: user.username, email: user.email, role: user.role } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
