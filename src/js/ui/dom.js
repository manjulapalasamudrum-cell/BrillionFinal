/**
 * Shared UI plumbing. The app deliberately runs with no build step, so there
 * is no JSX — `h` is React.createElement and every component calls it directly.
 * React itself is loaded as a global by `vendor/react-19.2.6.js`.
 */

export const React = window.React;
export const h = React.createElement;
export const { useState, useEffect, useRef } = React;

export function focusEl(ref) {
  if (ref.current) ref.current.focus();
}

export function selectEl(ref) {
  if (ref.current) ref.current.select();
}
