
export interface User{
    _id: string;
    email: string;
    role: string[];
    createdBugs: string[];
    assignedBugs: string[];
    fullName: string
    permissions: Permissions;
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
  comments?: string[];
  testCases?: string[];
  createdAt?: string;
  lastUpdated?: string;
  classification?: string;
  fixInVersion?: string;
  fixedOnDate?: string;
  closedOn?: string;
  workHoursLogged?: string[]
}

export interface Permissions {
  canEditAnyUser: boolean;
  canViewData: boolean;
  canAssignRoles: boolean;
  canCreateBug: boolean;
  canEditAnyBug: boolean;
  canCloseAnyBug: boolean;
  canClassifyAnyBug: boolean;
  canReassignAnyBug: boolean;
  canEditMyBug: boolean;
  canEditIfAssignedTo: boolean;
  canReassignIfAssignedTo: boolean;
  canBeAssignedTo: boolean;
  canLogHours: boolean;
  canApplyFixInVersion: boolean;
  canAssignVersionDate: boolean;
  canAddComment: boolean;
  canAddTestCase: boolean;
  canEditTestCase: boolean;
  canDeleteTestCase: boolean;
}

