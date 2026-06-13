import { usertypeDefs } from "./user.js";
import { baseTypeDefs } from "./baseschema.js";
import { workspacetypeDefs } from "./workpsace.js";
import { ProjectsTypeDefs } from "./projects.js";
import { taskstypdedefs } from "./tasks.js";
import { commentsTypedefs } from "./comments.js";
import { dependencyTypedefs } from "./dependency.js";
import { activityLogTypeDefs } from "./activitylogs.js";

export const typeDefs=`#grpahql
${baseTypeDefs},
${usertypeDefs},
${workspacetypeDefs},
${ProjectsTypeDefs},${taskstypdedefs},${commentsTypedefs},${dependencyTypedefs},${activityLogTypeDefs}

`