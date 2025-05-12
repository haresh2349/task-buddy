import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

Object.assign(global, { TextDecoder, TextEncoder });

// Polyfill for HTMLFormElement.requestSubmit in jsdom
// if (!HTMLFormElement.prototype.requestSubmit) {
//   HTMLFormElement.prototype.requestSubmit = function () {
//     this.dispatchEvent(
//       new Event("submit", { bubbles: true, cancelable: true })
//     );
//   };
// }
