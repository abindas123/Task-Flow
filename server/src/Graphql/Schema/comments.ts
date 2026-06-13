export const commentsTypedefs=`#graphql

type comments {
id:ID!
task_id:ID!
author_id:ID!
body:String!
created_at:String
Updated_at:String
}

extend type Mutation{

Createcomment(
task_id:ID!
author_id:ID!
body:String!
):comments!
Updatecomment(id:ID!
body:String!
):comments!

Deletecomment(id:ID!):comments!

}

extend type Query{
Getcommentsbytask(task_id:ID!):[comments!]!
}


`