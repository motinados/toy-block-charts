import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Tests import from "vitest" explicitly rather than relying on globals, so
// Testing Library's automatic cleanup does not kick in on its own.
afterEach(() => {
  cleanup();
});
