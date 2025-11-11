import {auth} from '../auth.js'
export async function isAuthenticated(req, res, next) {
    try{
        console.log('[DEBUG] Checking authentication for request headers:', req.headers);
        const session = await auth.api.getSession({headers: req.headers});
          console.log('[DEBUG] Session retrieved:', session);
        if(!session){
            return res.status(401).json({
                error: "Unauthorized",
                message: "You must be logged in to access this resources"
            })
        }
         console.log('[DEBUG] Session valid, attaching user and session to request');
        req.user = session.user;
        req.session = session.session;
        next();
    }catch (error){
        return res.status(401).json({
            error: "Unauthorized",
            message: "Invalid or expired session"
        })
    }
}
