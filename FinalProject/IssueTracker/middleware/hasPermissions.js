import { error } from "better-auth/api";
import { getDatabase } from "../database.js";

export const hasPermissions = (permission) => {
    return async(req, res, next) => {
        try{
            const userRoles = req.user.role || [];

            if(!Array.isArray(userRoles) || userRoles.length === 0){
                return res.status(403).json({error: 'No roles assigned to user'})
            }
            const db = await getDatabase();
            const rolesCollection = db.collection('role')

            const roleDocuments = await db.collection('role').find({ name: {$in: userRoles}}).toArray();

            console.log(`User roles: ${userRoles}`);
            console.log('Role documents from DB:', roleDocuments)

            const hasRequiredPermission = roleDocuments.some(roleDoc => {
                return roleDoc.permissions && roleDoc.permissions[permission] === true;
            });
            if(!hasRequiredPermission) {
                return res.status(403).json({
                    error: `Permission denied. Required permission: ${permission}`
                })
            }
                

        } catch (error){

        }
    }
}