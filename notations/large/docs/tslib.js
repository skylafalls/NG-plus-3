window.tslib = (function () {
  const extendStatics = Object.setPrototypeOf ||
    (Array.isArray({ __proto__: [] }) && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (const p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
  return {__extends: function (d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }};
})();
