import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import communities from '../../data/communities'
import PageHeading from '../PageHeading'
import EmptyState from '../EmptyState'
import ConfirmDialog from '../ConfirmDialog'
import { useToast } from '../../context/ToastContext'

export default function MyCommunities({
  joinedCommunities,
  toggleJoin,
  onViewLocation,
}: {
  joinedCommunities: number[]
  toggleJoin: (id: number) => void
  onViewLocation: (locationId: number) => void
}) {
  const { showToast } = useToast()
  const [leaveId, setLeaveId] = useState<number | null>(null)

  const joinedItems = useMemo(
    () => communities.filter(c => joinedCommunities.includes(c.id)),
    [joinedCommunities]
  )

  const leaveTarget = leaveId ? communities.find(c => c.id === leaveId) : null

  function confirmLeave() {
    if (!leaveTarget) return
    toggleJoin(leaveTarget.id)
    showToast(`Left "${leaveTarget.name}"`, 'info')
    setLeaveId(null)
  }

  return (
    <div className="page-panel">
      <div className="content-panel">
        <PageHeading
          title="My Communities"
          description="Communities you've joined — view meeting details, upcoming activities, and campus locations."
          breadcrumbs={[{ label: 'Community', to: '/community' }, { label: 'My communities' }]}
          actions={
            <>
              <Link to="/community/directory" className="btn primary">Browse directory</Link>
              <Link to="/community" className="btn">Community home</Link>
            </>
          }
        />

        {joinedItems.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No communities joined"
            description="Explore the directory to find clubs and groups that match your interests."
            actions={<Link to="/community/directory" className="btn primary">Browse directory</Link>}
          />
        ) : (
          <div className="card-grid card-grid--single">
            {joinedItems.map(comm => (
              <div key={comm.id} className="community-card community-card--joined">
                <div className="community-card-header">
                  <span className="community-category-badge">{comm.category}</span>
                  <span className="community-joined-badge">Joined</span>
                </div>
                <Link to={`/community/${comm.id}`} className="card-title-link">{comm.name}</Link>
                <div className="meta">Led by {comm.leader} · {comm.memberCount} members</div>
                <p className="card-body">{comm.description}</p>
                <div className="label-group">
                  <span className="label-chip">{comm.meetingSchedule}</span>
                  <span className="label-chip">{comm.meetingFormat}</span>
                </div>
                <div className="card-actions">
                  <Link to={`/community/${comm.id}`} className="btn primary">View community</Link>
                  <button type="button" className="btn" onClick={() => onViewLocation(comm.locationId)}>
                    View on map
                  </button>
                  <button type="button" className="btn" onClick={() => setLeaveId(comm.id)}>
                    Leave
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <ConfirmDialog
          open={leaveId !== null}
          title="Leave community?"
          message={leaveTarget ? `You will no longer see "${leaveTarget.name}" in your joined communities.` : ''}
          confirmLabel="Leave community"
          danger
          onConfirm={confirmLeave}
          onCancel={() => setLeaveId(null)}
        />
      </div>
    </div>
  )
}
