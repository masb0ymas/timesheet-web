import { ProjectEntity } from "./project"
import { UserEntity } from "./user"

export interface TeamEntity {
  id: string
  created_at: Date
  updated_at: Date
  user_id: string
  user: UserEntity
  project_id: string
  project: ProjectEntity
  remaining_time: string
}
