import * as mongoose from 'mongoose'
import { User } from '.'

const users = [
  {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: '$2b$10$.1CCJBrvzuR1e17YRaMY/ubN87EFsWJ92j8dlsD4BB2fTFPUlSY4O' // 00000000
  },
  {
    name: 'Jane Doe',
    email: 'janedoe@gmail.com',
    password: '$2b$10$Gqe1xdwJk55OjbT0q/Ed6.4Pw.yJemsh1tgQ4oqWDPml/5HdE4QWq' // 00000000
  },
  {
    name: 'Admin',
    email: 'admin@gmail.com',
    role: 'DEVELOPER',
    password: '$2a$10$pdLQwrnrgl50/ojeDaDHnuF2eKFCJshLjbED/X8zLkU7t/6nY7bKK'
  }
]

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    })

    await User.create(users)

    await mongoose.disconnect()
  } catch (error) {
    return console.error(error)
  }

  return
}

main()
