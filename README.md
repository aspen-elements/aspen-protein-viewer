# Aspen-Protein-Viewer

Component to render the 3D structure of the target.

# Installation and usage

Install this component using either of the following command

```
npm i github:aspen-elements/aspen-protein-viewer

yarn add github:aspen-elements/aspen-protein-viewer
```

Then use it in your app:

```js
import { LitElement, html } from "lit-element";
import "aspen-protein-viewer/ngl-viewer";

class DemoClass extends LitElement {
  static get styles() {
    return css`
      .ngl-viewer-wrapper {
        width: 400px;
        height: 400px;
      }
    `;
  }

  render() {
    return html`
      <div class="ngl-viewer-wrapper">
        <ngl-viewer dataResource="rcsb://4F0I"> </ngl-viewer>
      </div>
    `;
  }
}

customElements.define("demo-class", NGLViewer);
```

## Props

| Props               | Type     | Description                                                        |
| ------------------- | -------- | ------------------------------------------------------------------ |
| dataResource        | String   | (Required) Holds the resource object, for example: `"rcsb://4f0i"` |
| domainOrganizations | Array    | (Optional) Array to represent domain organization                  |
| error               | Object   | (Optional) Error state                                             |
| onUpdate            | Function | (Optional) Function to handle loader                               |

