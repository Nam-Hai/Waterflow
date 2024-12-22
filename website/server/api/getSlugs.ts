// import mocks from "./mocks.json"
export default defineEventHandler(async (event) => {
    const response = [
        {
            "name": "Neomi"
        },
        {
            "name": "Lea"
        },
        {
            "name": "Leo"
        },
        {
            "name": "Nam"
        }
    ]
    return response
})