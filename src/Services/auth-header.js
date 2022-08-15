export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('loginDetails'));

    if(user && user.token){
        return {Authorization:`Bearer ${user.token}`}
    }
}