export default (to, from, next) => {
    if(!localStorage.getItem('user') || !localStorage.getItem('token')){
        localStorage.clear();
        next({ name: 'Login' });
        return false;
    }
    return next();
}