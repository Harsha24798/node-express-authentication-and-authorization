// models/User.js
import { DataTypes, Model } from 'sequelize'
import bcrypt from 'bcryptjs'
import { sequelize } from '../config/database.js'

export class User extends Model {
  async comparePassword(password) {
    return await bcrypt.compare(password, this.password)
  }
}

User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'user'), defaultValue: 'user' },
  refreshToken: { type: DataTypes.STRING }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10)
    }
  }
})
