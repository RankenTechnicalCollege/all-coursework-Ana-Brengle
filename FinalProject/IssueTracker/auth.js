import { betterAuth } from "better-auth";
import { getClient, getDatabase } from "./database.js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { string } from "joi";

const client = await getClient();
const db = await getDatabase();


export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8080",
    trustedOrigins: ["http://localhost:8080", "http://localhost:5173","http://localhost:3000","https://issuetracker-2025-470049259207.us-central1.run.app/"],
    database: mongodbAdapter(db,{
        client
    }),
    emailAndPassword: {
        enabled: true
    },
    session: {
        cookieCache: true, 
        maxAge: 60 * 60,
    },
    user: {
        additionalFields: {
            givenName: {
                type: "string",
                required: true
            },
            familyName: {
                type: "string",
                required: true
            },
            fullName: {
                type: "string",
                required: true
            }, 
            createdBugs: {
                type: "object",
                required: true,
                defaultValue: []
            },
            assignedBugs: {
                type: "object",
                required: true,
                defaultValue: []
            }, 
            givenName: {
                type: "string",
                required: true
            }
        }
    }

});