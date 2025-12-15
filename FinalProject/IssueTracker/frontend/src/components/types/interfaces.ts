
export interface User{
    id: string;
    name: string;
    email: string;
    role: string[];
    createdBugs: string[];
    assignedBugs: string[];
    fullName: string
}


/////////////BUGS//////////// 

export interface Bug {
  id?: string;
  bugId?: string;
  title?: string;
  description?: string;
  stepsToReproduce?: string;
  authorOfBug?: string;
  statusLabel?: string;
  status?: boolean;
  assignedUser?: string;
  assignedUserName?: string;
  assignedTo?: string;
  comments?: Comment[];
  testCases?: TestCase[];
  createdAt?: string;
  lastUpdated?: string;
  classification?: string;
  fixInVersion?: string;
  fixedOnDate?: string;
  closedOn?: string;
  workHoursLogged?: string
}

export interface TestCase  {
  title?: string;
  status?: 'pass' | 'fail';
};

export interface Comment  {
  authorName?: string;
  text?: string
};

export interface SearchFilters {
  id?: string;
  keywords?: string;
  classification?: string;
  role?: string;
  closed?: boolean;
  minAge?: number;
  maxAge?: number;
  pageNum?: number;
  pageSize?: number;
  sortBy?: 'newest' | 'oldest' | 'title' | 'classification' | 'assignedTo' | 'createdBy' | 'role'; // Sorting options

}
