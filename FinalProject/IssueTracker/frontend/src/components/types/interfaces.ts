
export interface User{
    _id: string;
    email: string;
    role: string[];
    createdBugs: string[];
    assignedBugs: string[];
    fullName: string;
}


/////////////BUGS//////////// 

export interface Bug {
  _id?: string;
  bugId?: string;
  title?: string;
  description?: string;
  stepsToReproduce?: string;
  authorOfBug?: string;
  statusLabel?: string;
  status?: boolean;
  createdOn: string
  assignedUser?: string;
  assignedUserName?: string;
  assignedTo?: string;
  comments?: Comments[];
  testCases?: TestCases[];
  createdAt?: string;
  lastUpdated?: string;
  classification?: string;
  fixInVersion?: string;
  fixedOnDate?: string;
  closedOn?: string;
  workHoursLogged?: string[]
}

export interface TestCases {
  _id?: string;
  testId?: string;
  text?: string;
  testAuthor?:{
    _id?: string;
    fullName: string;
  }
  createdOn?: string | Date;
}

export interface Comments {
  _id?: string;
  commentId?: string;
  text?: string;
  commentAuthor?: {
    _id?: string;
    fullName: string;
  }
  createdOn?: string | Date;
}

