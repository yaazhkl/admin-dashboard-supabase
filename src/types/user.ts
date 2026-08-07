export interface User {
  id: number
  fullname: string
  email: string
  departmentId: number
  positionId: number
  active: boolean
}

export interface Admin {
  id : number
  username : string
  password : string
  name : string
  email : string
  role : string
}

export interface AdminChange extends Admin{
  username : string
  password : string
  name : string
  email : string
}

export interface UserTable extends User {
    departmentName: string
    positionName: string
}

export interface Department {
  id: number
  name : string
  code : string
  description : string
}

export interface DepartmentTable extends Department{
  employeeCount : number
  positionCount : number
}

export interface Position {
  id: number
  departmentId: number
  name : string
  code : string
}

export interface PositionTable extends Position{
  departmentName? : string
  employeeCount : number
}

export interface ActivityLog{
  id? : number;
  user: string;
  action: string;
  module: string;
  description: string;
  created_at: string;
}

export interface CreateActivityLog{
  id? : number;
  user: string;
  action: string;
  module: string;
  description: string;
}