export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="space-y-3 text-xs text-muted-foreground">
          <p>
            <strong>Important Disclosures:</strong> The outcome values shown are hypothetical and for illustrative purposes only.
            Actual outcomes may differ. Outcome values may only be realized by an investor who holds shares for the entire outcome period shown.
            Investors who purchase shares after the outcome period has begun or sell shares prior to the end of the outcome period may experience
            very different outcomes than those shown.
          </p>
          <p>
            Past performance is not a guarantee of future results. Investment value will fluctuate, and shares,
            when redeemed, may be worth more or less than original cost.
          </p>
          <p className="text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Corgi Strategies, LLC. All rights reserved.
            This is a demo application built for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
