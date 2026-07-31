import React, { useState } from 'react'
import { AvailabilitySlot, CareerMeeting, MeetingFormat } from '../../types/CareerAdvising'
import { v4 as uuidv4 } from 'uuid'

export default function BookingForm({ slot, onConfirm }:{ slot: AvailabilitySlot, onConfirm: (meeting: CareerMeeting) => void }){
  const [topic, setTopic] = useState('Resume review')
  const [message, setMessage] = useState('')
  const [format, setFormat] = useState<MeetingFormat>('in_person')

  function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    const meeting: CareerMeeting = { id: uuidv4(), advisorId: slot.advisorId, availabilitySlotId: slot.id, topic, studentMessage: message, meetingFormat: format, status: 'confirmed' }
    onConfirm(meeting)
  }

  return (
    <form onSubmit={handleSubmit} style={{border:'1px solid #eee',padding:12,borderRadius:8,marginTop:12}}>
      <div>
        <label>Topic</label>
        <select value={topic} onChange={e => setTopic(e.target.value)}>
          <option>Resume review</option>
          <option>Internship search</option>
          <option>Job search</option>
          <option>Interview preparation</option>
          <option>Graduate school guidance</option>
          <option>Research career guidance</option>
          <option>Networking advice</option>
        </select>
      </div>
      <div>
        <label>Notes (short)</label>
        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} style={{width:'100%'}} />
      </div>
      <div>
        <label>Meeting format</label>
        <select value={format} onChange={e => setFormat(e.target.value as MeetingFormat)}>
          <option value="in_person">In-person</option>
          <option value="online">Online</option>
        </select>
      </div>
      <div style={{marginTop:8}}>
        <button className="btn" type="submit">Confirm booking</button>
      </div>
    </form>
  )
}
