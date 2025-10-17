import { createFactory } from "hono/factory";
import type { JwtVariables } from "hono/jwt";

export type Variables = {
	//   session: Session<SessionData>;
	//   session_key_rotation: boolean;
} & JwtVariables;

export const webFactory = createFactory<{
	Variables: Variables;
}>();
