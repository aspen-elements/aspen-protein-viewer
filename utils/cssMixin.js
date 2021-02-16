import { css } from "lit-element";

/**
 * CSS to reset margin, padding and box-sizing style.
 *
 * @return {CSSResult}
 */
export const resetCSS = css`
  :host,
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;
