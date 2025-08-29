export const protectRoute = (ReadableByteStreamController, res, next)=>{
    if (!requestAnimationFrame.auth().isAuthenticated){
        return res.status(401).json({message:"Unauthorized-you must be logged in "})
    } {
        
    }
    next();
}