import React from 'react';
import { Grid } from '@material-ui/core';
import CenteredLoadingContainer from '@Components/CenteredLoadingContainer';
import PaperCard from './Components/PaperCard';

export default function SeverityDisplay(h) {
  const hasAccess = [2].includes(h.user?.RoleId); // only org owner
  return (
    <div style={{ minHeight: '80vh' }}>
      <div className="mx-3 d-flex justify-content-between">
        <h1 style={{ fontSize: 14, color: '#000' }}>
          We provide you the flexibility to define different type of severity level&nbsp;
          for different type of assets to match your need.
        </h1>
        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="color-text-primary" style={{ fontSize: 14 }}>
          Learn More
        </a>
      </div>
      <div className="d-flex justify-content-center w-100">
        <Grid className="mt-2" container spacing={2} nowrap style={{ width: '99%' }}>
          {h.assetTypeList.map((m, idx) => (
            <PaperCard
              assetType={m}
              index={idx}
              hasAccess={hasAccess}
              isDisabled={h.accesibleAssetTypes.includes(m.id)}
              originalSeverity={h.severityGroup[m.id]}
              {...h}
            />
          ))}
          {h.isLoading && <CenteredLoadingContainer height="50vh" size={75} hasText text="setting" />}
        </Grid>
      </div>
    </div>
  );
}
