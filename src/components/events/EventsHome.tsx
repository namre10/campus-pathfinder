import React from 'react'
import { Link } from 'react-router-dom'

export default function EventsHome(){
  return (
    <div style={{padding:20}}>
      <h2>Events & Opportunities</h2>
      <p>Find campus events, workshops, and opportunities.</p>
      <div style={{display:'flex',gap:12,marginTop:16}}>
        <Link to="/events" className="btn">Browse Events</Link>
        <Link to="/career/opportunities" className="btn">Opportunities</Link>
      </div>
    </div>
  )
}
