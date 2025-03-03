import type { Session } from '@auth/core/types'
import { User, Employee, Role, Scope } from '@prisma/client'

import type { inherits } from 'util'

declare global {
	type EnhancedSessionType = Session & {
		authUser: User & {
			Employee: Employee & {
				Role: Role & {
					Scopes: Scope[]
				}
			}
		}
	}

	namespace App {
		interface Locals {
			getSession(): Promise<EnhancedSessionType | null>
		}
		interface PageData {
			session: EnhancedSessionType | null
		}
	}
}

export {}
