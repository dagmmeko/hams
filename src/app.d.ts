import type { Session } from '@auth/core/types';
import { User, type Warehouse } from '@prisma/client';
import { Employee } from '@prisma/client';

import { Scope } from '@prisma/client';
import type { inherits } from 'util';

declare global {
	type EnhancedSessionType = Session & {
		userData: User;
		employeeData: Employee;
		userScopes: Scope[];
	};

	namespace App {
		interface Locals {
			getSession(): Promise<EnhancedSessionType | null>;
		}
		interface PageData {
			session: EnhancedSessionType | null;
		}
	}
}

export {};
