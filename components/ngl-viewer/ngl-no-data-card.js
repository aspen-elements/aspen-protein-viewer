import { nothing } from 'lit-html'
import { LitElement, css, html } from 'lit-element'

import './empty-state-structure'
import { isEmpty as isStringEmpty } from './utils'

/**
 * No Project Card
 *
 * <no-data-card message={message: String} icon={iconName: String}><slot></slot></no-data-card>
 *
 * custom css variables available
 * no-data-card {
    --card-height: auto;
    --icon-size: var(--font-size-h1, 100px);
    --icon-color: var(--color-grey-300);
    --message-size: var(--font-xlg);
    --message-color: var(--color-black);
    --message-weight: var(--fontWeight-bold);
    --description-size: var(--font-md);
    --description-color: var(--color-grey-600);
 * }
 */
class NoDataCard extends LitElement {
  /**
   * Properties.
   */
  static get properties() {
    return {
      /**
       * heading message for no-data
       * pass from parent
       *
       * @type {{message: String}}
       */
      message: String,

      /**
       * description for no-data
       * pass from parent
       *
       * @type {{description: String}}
       */
      description: String,
    }
  }

  /**
   * Styles.
   */
  static get styles() {
    return css`
      :host {
        --color-black: #000000;
        --color-grey-300: #e0e0e0;
        --color-grey-600: #757575;

        --font-xlg: 1.25rem;
        --font-md: 0.875rem;
        --font-size-h1: 6rem;
        --fontWeight-bold: 600;

        --spacing-5x: 1.25rem;
        --spacing-2x: 0.5rem;

        --card-height: auto;
        --card-width: 100%;
        --icon-size: var(--font-size-h1, 100px);
        --icon-color: var(--color-grey-300);
        --message-size: var(--font-xlg);
        --message-color: var(--color-black);
        --message-weight: var(--fontWeight-bold);
        --description-size: var(--font-md);
        --description-color: var(--color-grey-600);
      }

      .card-content {
        width: var(--card-width);
        margin: 0 auto;
        height: var(--card-height);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .no-data-icon {
        color: var(--icon-color);
        --mdc-icon-size: var(--icon-size);
        padding-bottom: var(--spacing-5x);
      }

      .no-data-image {
        display: block;
        width: var(--icon-size);
        height: var(--icon-size);
        padding-bottom: var(--spacing-5x);
      }

      .message-heading {
        font-size: var(--message-size);
        line-height: var(--message-size);
        font-weight: var(--message-weight);
        color: var(--message-color);
        padding: 0;
        margin: 0;
        padding-bottom: var(--spacing-2x);
      }

      p.message-description {
        font-size: var(--description-size);
        line-height: var(--description-size);
        color: var(--description-color);
        text-align: center;
        padding: 0;
        margin: 0;
      }

      img {
        overflow: hidden;
      }

      ::slotted(*) {
        margin: 0;
        padding: 0;
      }
    `
  }

  /**
   * Constructor.
   */
  constructor() {
    super()
    this.message = ''
    this.description = ''
  }

  /**
   * Lifecycle callback.
   *
   * @returns {*}
   */
  render() {
    return html`
      <div class="card-content">
        <empty-state-structure></empty-state-structure>
        ${!isStringEmpty(this.message)
          ? html` <div class="message-heading">${this.message}</div> `
          : nothing}
        ${!isStringEmpty(this.description)
          ? html` <p class="message-description">${this.description}</p> `
          : nothing}
        <slot></slot>
      </div>
    `
  }
}

customElements.define('ngl-no-data-card', NoDataCard)
