import React from 'react'
import { Navigate } from 'react-router-dom'

/** @deprecated Use PathfinderHome at / instead */
export default function Dashboard() {
  return <Navigate to="/" replace />
}
