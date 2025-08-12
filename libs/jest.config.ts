export default {
  displayName: 'libs',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/libs',
  roots: ['<rootDir>/src/lib', '<rootDir>/src/utils', '<rootDir>/src/shared-components'],
};
