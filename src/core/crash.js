function noop() {
  return;
}

globalThis.NotImplementedError = class NotImplementedError extends Error {
  constructor() {
    super("The method is not implemented.");
    this.name = "NotImplementedError";
  }
};

globalThis.GlobalErrorHandler = {
  handled: false,
  cleanStart: false,
  onerror(event) {
    if (this.handled) {
      return;
    }
    this.handled = true;
    if (!this.cleanStart) {
      document.querySelector("#loading").style.display = "none";
      requestAnimationFrame(() => this.crash(event));
      return;
    }
    this.stopGame();
    this.crash(event);
  },
  stopGame() {
    GameKeyboard.disable();
    GameIntervals.stop();
    const clearHandles = (set, clear) => {
      let id = set(noop, 9999);
      while (id--) {
        clear(id);
      }
    };
    clearHandles(setInterval, clearInterval);
    clearHandles(setTimeout, clearTimeout);
    clearHandles(requestAnimationFrame, cancelAnimationFrame);
  },
  crash(message) {
    console.error(`Error detected while running game: ${message}`);
    if (window.GameUI !== undefined && GameUI.initialized) {
      Modal.message.show(
        `${message}<br>Check the console for more details`,
        {},
        3,
      );
    }

    // debugger;
  },
};

window.addEventListener("error", (event) => {
  GlobalErrorHandler.onerror(event.error);
});
