export function DisclaimerBox() {
  return (
    <div className="rounded-lg border bg-muted/30 p-4 text-xs text-muted-foreground space-y-2">
      <p>
        <strong>Important:</strong> Outcome values may only be realized for an investor who holds shares
        for the entire outcome period shown. Investors who purchase or sell shares during the outcome period
        may experience very different outcomes.
      </p>
      <p>
        Past performance is not a guarantee of future results. Investment value will fluctuate.
      </p>
    </div>
  );
}
