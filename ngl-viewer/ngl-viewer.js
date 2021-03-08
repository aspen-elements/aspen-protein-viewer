import { nothing } from "lit-html";
import { css, html, LitElement } from "lit-element";
import { classMap } from "lit-html/directives/class-map";

import "./ngl-no-data-card";
import * as NGL from "./ngl.esm";

import { STRUCTURES } from "../lang/en";
import { resetCSS } from "../utils/cssMixin";
import { isObjectEmpty, areObjectsEqual } from "../utils/objects";
import { debounce, doubleRaf, convertToDomain } from "../utils/misc";

/**
 * Component to render the 3D structure of the target.
 */
class NglViewer extends LitElement {
  /**
   * Styles.
   *
   * @returns {CSSResult}
   */
  static get styles() {
    return [
      resetCSS,
      css`
        #viewport {
          width: 100%;
          height: 98%;
          min-height: 120px;
        }

        .hidden {
          display: none;
        }

        .dead-center-middle {
          height: 96%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `,
    ];
  }

  /**
   * Watched Properties.
   *
   * @returns {Object}
   */
  static get properties() {
    return {
      /**
       * Holds the protein data bank's ID, for example: `rcsb://4f0i`.
       *
       * @type {string}
       */
      pdbID: String,

      /**
       * Array to represent domain organizations.
       *
       * @type {{colorRegistry: Array}}
       */
      colorRegistry: Array,

      /**
       * To handle load complete.
       *
       * @type {function }
       */
      onLoadSuccess: Function,

      /**
       * Function to handle error
       *
       * @type {function }
       */
      onLoadFail: Function,

      /**
       * Error state.
       *
       * @type {Object}
       */
      error: Object,

      /**
       * Loading state
       *
       * @type {Boolean }
       */
      isLoading: Boolean,
    };
  }

  /**
   * Error details for 404.
   *
   * When this component gets an invalid PDB id, it tries to fetch it and fails
   * with an error. It should have been handled as the rejected Promise in
   * `this.stage.loadFile`, but that does not happen. Somehow, the code crashes
   * without the Promise rejection. Hence, we needed to add error event
   * listeners in window level. The error also causes other errors in the app
   * to auto-dismiss once shown as the error dialog set globally in the root
   * component of the application.
   *
   * Hence, we will try to recognize the error using the values as returned
   * below. I have found these values to be consistent, as far as I have tested.
   *
   * @returns {Object}
   */
  static get error404() {
    return {
      type: "error",
      message: "Error: NetworkStreamer._read: status code 404",
    };
  }

  /**
   * Constructor.
   */
  constructor() {
    super();

    this.stage = {};

    this.pdbID = "";
    this.error = {};
    this.isLoading = true;
    this.colorRegistry = [];

    this.onLoadFail = () => {};
    this.onLoadSuccess = () => {};

    this.onResize = debounce(this.onResize.bind(this), 100);
    this.update3DStructure = debounce(this.update3DStructure.bind(this), 500);
    this.handleError = this.handleError.bind(this);
  }

  /**
   * Invoked just after the node is connected to the DOM.
   */
  connectedCallback() {
    super.connectedCallback();

    window.addEventListener("resize", this.onResize);
    window.addEventListener("error", this.handleError);
  }

  /**
   * Invoked just before the node is disconnected from the DOM.
   */
  disconnectedCallback() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("error", this.handleError);

    super.disconnectedCallback();
  }

  /**
   * Called after the first render.
   *
   * @param {*} changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);

    const viewport = this.shadowRoot.getElementById("viewport");

    this.stage = new NGL.Stage(viewport, {
      backgroundColor: "white",
    });

    this.update3DStructure();
  }

  /**
   * Called after the each render.
   *
   * @param {*} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    changedProperties.delete("error");
    changedProperties.delete("isLoading");

    if (changedProperties.size) this.update3DStructure();
  }

  /**
   * Handle the resize event.
   */
  onResize() {
    doubleRaf(() => this.stage.handleResize());
  }

  /**
   * Handle errors not caught by usual means.
   *
   * @param {Object} event
   */
  handleError(event) {
    const error = { type: event.type, message: event.message };

    this.onLoadFail();
    this.isLoading = false;

    if (!areObjectsEqual(error, this.constructor.error404)) {
      this.error = error;
      return true;
    }

    event.preventDefault();
    event.stopPropagation();

    this.error = error;
    return false;
  }

  /**
   * Update the 3D Structure.
   */
  update3DStructure() {
    this.stage.removeAllComponents();

    doubleRaf(() =>
      this.load3DView()
        .then(() => {
          doubleRaf(() => this.stage.handleResize());
          this.error = {};
          this.onLoadSuccess();
        })
        .catch((error) => {
          this.error = error;
          this.onLoadFail();
        })
        .finally(() => {
          this.isLoading = false;
        })
    );
  }

  /**
   * Load the 3D view in the Stage.
   */
  load3DView() {
    const domains = this.colorRegistry.map(convertToDomain);

    const schemeId = NGL.ColormakerRegistry.addScheme(function (params) {
      this.atomColor = (atom) => {
        const section =
          domains &&
          domains.find(
            (domain) => atom.serial >= domain.start && atom.serial <= domain.end
          );

        return !section ? "0Xffffff" : section.color;
      };
    });

    return (
      this.stage &&
      this.stage.loadFile(this.pdbID).then((o) => {
        o.addRepresentation("cartoon", {
          color: schemeId,
        });
        o.autoView();
      })
    );
  }

  /**
   * Main render.
   *
   * @returns {*}
   */
  render() {
    const hasError = !isObjectEmpty(this.error);

    const viewportClassMap = {
      hidden: hasError || this.isLoading,
    };

    return html`
      <div class="${classMap(viewportClassMap)}" id="viewport"></div>

      ${hasError
        ? html` <div class="dead-center-middle">
            <ngl-no-data-card
              message="${STRUCTURES.ERROR_MESSAGE}"
              description="${STRUCTURES.ERROR_DESCRIPTION}"
            ></ngl-no-data-card>
          </div>`
        : this.isLoading
        ? html`
            <div class="dead-center-middle">
              <ngl-no-data-card
                message="${STRUCTURES.LOADING}"
              ></ngl-no-data-card>
            </div>
          `
        : nothing}
    `;
  }
}

customElements.define("ngl-viewer", NglViewer);
