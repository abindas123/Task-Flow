export const taskstypdedefs=`#graphql
type tasks {
id :ID!,
    title:String!,
    description:String,
    status :String!,
    priority :String!,
    project_id:ID!,
    assignee_id :ID,
    due_date :String,
    created_by :ID!,
    created_at :String,
    updated_at :String
}

extend type Mutation{
Createtask(
title:String!,
    description:String,
    status :String!,
    priority :String!,
    project_id:ID!,
    assignee_id :ID,
    due_date :String,
    

):tasks!

Updatetask(id:ID!,
title:String!,
    description:String,
    priority :String!,
    assignee_id :ID,
    due_date :String):tasks!
Updatetaskstatus(id:ID!,status:String!):tasks!
}
extend type Query{
Gettaskbyid(id:ID!):tasks
Gettasksbyproject(project_id:ID!):[tasks!]!
}
`