import dotenv from "dotenv"

dotenv.config()

const password = process.env.DB_PASSWORD

if (!password) {
    throw new Error("Missing DB_PASSWORD environment variable")
}

const uri = `mongodb+srv://ragtivity:PvmzNn51vSXyimW9@cluster0.8ssge3h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
export default uri