import mocks from "./mocks.json"
export default defineEventHandler(async (event) => {
    const response = mocks
    return response
})