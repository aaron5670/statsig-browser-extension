import type {HealthCheck} from "~types/statsig";

import {Progress} from "@nextui-org/react";
import React from 'react';
import {Tooltip} from "react-tooltip";

export const HealthCheckSection = ({healthChecks}: {healthChecks?: HealthCheck[]}) => {
  if (!healthChecks || !healthChecks.length) {
    return null;
  }

  // calculate the progress if all statuses are PASSED, then it's 100%.
  const progress = healthChecks?.reduce((acc, healthCheck) => {
      if (healthCheck.status === "PASSED") {
        acc += 100 / healthChecks.length;
      }
      return acc;
    }, 0);

  return (
    <>
      <Progress
        aria-label="Downloading..."
        className="w-full mt-5"
        color="success"
        label="Checklist"
        showValueLabel={true}
        size="md"
        value={progress || 0}
      />

      {healthChecks?.map((healthCheck, index) => (
        <div className="flex items-center gap-2 mt-2" key={index}>
          {healthCheck.status === "PASSED" ? (
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-success"/>
          ) : (
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-400"/>
          )}
          <p className="text-sm" data-tooltip-id={`health-check-tooltip-${index}`}>{healthCheck.name}</p>
          <Tooltip
            className="text-sm"
            id={`health-check-tooltip-${index}`}
            opacity={1}
            place="right"
            variant="dark"
          >
            <div className="max-w-[275px] text-sm">
              {healthCheck.description}
            </div>
          </Tooltip>
        </div>
      ))}
    </>
  );
};
