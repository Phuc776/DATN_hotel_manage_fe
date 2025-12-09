"use client"

import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "../src/auth/AuthContext"
import AppRoutes from "../src/routes/AppRoutes"
import "../src/index.css"

export default function Page() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
