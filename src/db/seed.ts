import * as mongoose from 'mongoose'
import { User } from '.'

const users = [
  {
    username: 'johndoe',
    role: 'DEVELOPER',
    password: '$2b$10$.1CCJBrvzuR1e17YRaMY/ubN87EFsWJ92j8dlsD4BB2fTFPUlSY4O' // 00000000
  },
  {
    username: 'janedoe',
    password: '$2b$10$Gqe1xdwJk55OjbT0q/Ed6.4Pw.yJemsh1tgQ4oqWDPml/5HdE4QWq' // 00000000
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
