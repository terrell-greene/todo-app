module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node'
}

process.env = Object.assign(process.env, {
  APP_SECRET: 'SuperSecret!',
  MONGO_URI: 'mongodb://localhost:27017/todo',
  NODE_ENV: 'test'
})
