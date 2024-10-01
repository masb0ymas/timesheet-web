import { RoleEntity } from "./role"

export interface UserEntity {
  id: string
  created_at: Date
  updated_at: Date
  fullname: string
  email: string
  is_active: string
  is_blocked: string
  role_id: string
  role: RoleEntity
}
