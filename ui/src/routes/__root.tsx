import NavBar from '@/components/shared/nav/Navbar'
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <NavBar />
      <Outlet />
    </>
  ),
})