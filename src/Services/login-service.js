export default function Login() {
    const user = JSON.parse(localStorage.getItem("loginDetails"));

    if(user){
        return user;
    }
}