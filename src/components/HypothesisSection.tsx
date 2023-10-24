import React from 'react';

export const HypothesisSection = ({hypothesis}: {hypothesis?: string}) => (
  <>
    <h3 className="text-lg font-bold mt-5">Hypothese</h3>
    <p>{hypothesis ? hypothesis : 'Hypothesis not set.'}</p>
  </>
)
