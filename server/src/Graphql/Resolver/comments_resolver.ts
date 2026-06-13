
import {Createcommentservice,Deletecommentservice,
    Updatecommentservice,Getcommentsbytaskservice
} from '../../Services/comments.js'

type createcommentargs={
    task_id:string,
    author_id:string,
    body:string
}

type Updatecommentargs={
    id:string,
    body:string
}
type Deletecommentargs={
    id:string
}
type getcommentbytaskargs={
    task_id:string
}

export const commentresolver={
    Query:{
        Getcommentsbytask:async(_:unknown,args:getcommentbytaskargs)=>{
            return await Getcommentsbytaskservice(args.task_id)
        }
    },
    Mutation:{
        Createcomment:async(_:unknown,args:createcommentargs)=>{
            return await Createcommentservice(args.task_id,args.author_id,args.body)

        },
        Updatecomment:async(_:unknown,args:Updatecommentargs)=>{
            return await Updatecommentservice(args.id,args.body)
        },
        Deletecomment:async(_:unknown,args:Deletecommentargs)=>{
            return await Deletecommentservice(args.id)
        }
    }
}