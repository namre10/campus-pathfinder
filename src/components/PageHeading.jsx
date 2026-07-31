import React from 'react'
import Breadcrumbs from './Breadcrumbs'

export default function PageHeading({ title, description, breadcrumbs = [], actions, toolbar }) {
  return (
    <div className="page-heading-block">
      <Breadcrumbs items={breadcrumbs} />
      <div className="page-heading">
        <div className="page-heading-text">
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </div>
      {toolbar && <div className="page-toolbar">{toolbar}</div>}
    </div>
  )
}
