import { Fragment } from "react";

// Renders editable text where **words like this** become bold. Nothing else is interpreted,
// so text typed in /safehaven can never inject markup.
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? <b key={i}>{p.slice(2, -2)}</b> : <Fragment key={i}>{p}</Fragment>
      )}
    </>
  );
}
