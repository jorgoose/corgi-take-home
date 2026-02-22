"use client";

import { useState } from "react";
import { GLOSSARY_TERMS } from "@/lib/constants/glossary";

export function DefinitionsGlossary() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold hover:bg-muted/50 transition-colors"
      >
        <span>Definitions &amp; Glossary</span>
        <span className="text-muted-foreground">{isOpen ? "\u2212" : "+"}</span>
      </button>
      {isOpen && (
        <div className="border-t px-4 py-3 space-y-3">
          {GLOSSARY_TERMS.map((term) => (
            <div key={term.term}>
              <dt className="text-sm font-medium">{term.term}</dt>
              <dd className="text-sm text-muted-foreground mt-0.5">{term.definition}</dd>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
