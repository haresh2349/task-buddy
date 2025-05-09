// import type {Config} from "@jest/types"
const config = {
    preset:'ts-jest',
    testEnvironment:'node',
    setupFilesAfterEnv:['<rootDir>/src/tests/setup.ts'],
    testPathIgnorePatterns:['/node_modules/','/dist/'],
    coveragePathIgnorePatterns:['/node_modules/','/dist/'],
    collectCoverage:true,
    coverageReporters:['text','lcov']
}
export default config