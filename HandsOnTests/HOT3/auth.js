import { betterAuth } from "better-auth";
import { getClient, getDatabase } from "./database.js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = await getClient();
const db = await getDatabase();


export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:2023",
    trustedOrigins: ["http://localhost:2023", "http://localhost:5173","http://localhost:3000"],
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
            fullName: {
                type: "string",
                required: true
            }, 
            role: {
                type: "string",
                required: true
            }
        }
    }

});
