import React from 'react'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  danger = false,
}) {
  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onCancel} role="presentation">
      <div className="modal-dialog" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onCancel}>{cancelLabel}</button>
          <button type="button" className={`btn${danger ? '' : ' primary'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
