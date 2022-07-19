import React from 'react';
import {
  Box, Stepper, Step, StepLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  bgInactiveColor: {
    backgroundColor: '#CED2DB',
    color: '#8B95AB',
  },
});

function StepIconComponent({ active, completed, icon }) {
  const classes = useStyles();
  return (
    <div
      style={{ height: 40, width: 40 }}
      className={
        `flex-standard rounded-circle ${active || completed ? 'text-white bg-color-primary' : `${classes.bgInactiveColor}`}`
      }
    >
      <b>{icon}</b>
    </div>
  );
}

export default ({ activeStep, isOrgUnlimited }) => {
  const steps = ['Media Details', 'Data Format', 'Data Upload', isOrgUnlimited ? 'Summary' : 'Payment'];
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} style={{ width: '75%' }} className="bg-transparent mx-auto">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={StepIconComponent}>
              <h4 className="text-dark font-weight-bold">{label}</h4>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
