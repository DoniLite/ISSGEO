import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

const ScrollToTop = () => {
	const { pathname, hash } = useLocation({
		select: (location) => ({
			pathname: location.pathname,
			hash: location.hash,
		}),
	});
	useEffect(() => {
		globalThis.scrollTo(0, 0);
	}, [pathname, hash]);

	return null;
};

export default ScrollToTop;
