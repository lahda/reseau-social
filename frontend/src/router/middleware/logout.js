export default (to, from, next) => {
    if(localStorage.getItem('user') && localStorage.getItem('token')){
        next({ name: 'Posts' });
        return false;
    }
    return next();
}