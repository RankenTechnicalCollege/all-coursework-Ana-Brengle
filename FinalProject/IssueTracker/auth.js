import { betterAuth } from "better-auth";
import { getClient, getDatabase } from "./database.js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = await getClient();
const db = await getDatabase();


export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8080",
    trustedOrigins: ["http://localhost:8080", "http://localhost:3000","https://issuetracker-2025-470049259207.us-central1.run.app/"],
    database: mongodbAdapter(db,{
        client
    })
});