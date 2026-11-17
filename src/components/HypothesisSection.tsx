export const HypothesisSection = ({ hypothesis }: { hypothesis?: string }) => (
  <section className="grid gap-1">
    <h3 className="text-sm font-semibold">Hypothesis</h3>
    <p className="max-w-[70ch] whitespace-pre-wrap text-sm leading-relaxed text-default-700 wrap-anywhere">
      {hypothesis?.trim() || "No hypothesis has been set."}
    </p>
  </section>
);
