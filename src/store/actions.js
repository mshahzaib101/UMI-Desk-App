export default class actionMain {

    static user_loged_in = "userLogedIn";
    static user_loged_in_meh(value){
        return { 
            type: this.user_loged_in,
            payload: value
        }
    }
}