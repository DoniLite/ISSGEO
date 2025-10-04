import { createRoot } from "react-dom/client";
import { App } from "./App";
import elem from "./root";

if (import.meta.hot) {
	// With hot module reloading, `import.meta.hot.data` is persisted.
	// biome-ignore lint/suspicious/noAssignInExpressions: assuming this is intentional
	const root = (import.meta.hot.data.root ??= createRoot(elem));
	root.render(App);
} else {
	// The hot module reloading API is not available in production.
	createRoot(elem).render(App);
}
