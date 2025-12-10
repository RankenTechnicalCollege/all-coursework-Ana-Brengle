export interface UsersList{
    id: string;
    givenName: string;
    role: string[]

}
export interface UserListProps {
   users: UsersList[]
}
//////////////////////////////////////////
export interface SingleUser{
    _id: string;
    id: string;
    name: string;
    email: string;
    role: string[];
    createdBugs: string[];
    assignedBugs: string[];
}
export interface SingleUserProps {
   user: SingleUser
}

/////////////BUGS//////////// 

export interface BugsList {
    id: string,
    title: string,
    status: string
}
export interface BugsListProps{
    bugs: BugsList[]
}
export interface SingleBug {
    id: string,
    title: string,
    description: string,
    stepsToReproduce: string
}

export interface SingleBugProps {
    bug: SingleBug
}

