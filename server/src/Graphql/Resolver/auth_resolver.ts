import { register } from "node:module";
import { Loginuserservice, RegisterUserservice } from "../../Services/auth.js";
type Registeruserargs={
  name:string,
  email:string,
  password:string

}
type loginuser={
  email:string,
  password:string
}

export const Authresolver={
  Mutation:{
    registerUser:async(_:unknown,   args: Registeruserargs
    )=>{
      const {name,email,password}=args
      return await RegisterUserservice(name,email,password)
    },
    loginUser:async(_:unknown,args:loginuser)=>{
      const {email,password}=args
      return await Loginuserservice(email,password)
    }
},
}