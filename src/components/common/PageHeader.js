import React from "react";

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-2 mb-3">
      <div>
        <h3 className="m-0">{title}</h3>
        {subtitle ? <div className="text-muted mt-1">{subtitle}</div> : null}
      </div>
      {actions ? <div className="d-flex gap-2">{actions}</div> : null}
    </div>
  );
}
