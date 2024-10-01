import { ProjectEntity } from "./project"
import { UserEntity } from "./user"

export interface WorklogEntity {
  id: string
  created_at: Date
  updated_at: Date
  user_id: string
  user: UserEntity
  project_id: string
  project: ProjectEntity
  worked_at: Date
  duration: string
  remaining_time: string
  description: string
  is_billable: boolean
}
