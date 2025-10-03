import NavBar from '@/components/shared/nav/Navbar'
import ScrollToTop from '@/components/shared/ScrollToTop'
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <NavBar />
      <Outlet />
      <ScrollToTop />
    </>
  ),
})