import { Outlet } from "react-router"
import Header from "./Header.jsx"
import Footer from "./Footer.jsx"

export default function Layout() {
  return (
    <>
      <Header />
      <main className="container">
        {/* Child routes (HomePage, VendorPage, etc.) will render right here! */}
        <Outlet />
      </main>
      <Footer />
    </>
  )
}