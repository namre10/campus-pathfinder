import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function ContributionForm({ locationId, onSubmit }) {
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [tags, setTags] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const tip = {
      id: uuidv4(),
      locationId,
      text,
      rating: Number(rating),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      isModerated: false,
      createdAt: new Date().toISOString(),
    }
    onSubmit(tip)
    setText('')
    setTags('')
    setRating(5)
    alert('Thanks! Your tip was submitted for moderation.')
  }

  return (
    <form onSubmit={handleSubmit} className="form-stack" style={{ marginTop: 12 }}>
      <div className="form-field">
        <label htmlFor="tip-text">Tip / short recommendation</label>
        <textarea
          id="tip-text"
          required
          className="control-input"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
        />
      </div>
      <div className="form-field">
        <label htmlFor="tip-rating">Rating</label>
        <select id="tip-rating" className="control-input" value={rating} onChange={e => setRating(e.target.value)}>
          {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="tip-tags">Tags (comma separated)</label>
        <input
          id="tip-tags"
          className="control-input"
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="quiet, many outlets"
        />
      </div>
      <button className="btn primary" type="submit">Submit tip</button>
    </form>
  )
}
