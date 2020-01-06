function simulate() {
  document.onkeyup = function(e) {
    console.log(e.keyCode);
    if (27 == e.keyCode) {
      console.log("Esc");
    }
  };
  var evt = new KeyboardEvent("keyup", {
    keyCode: 27,
    which: 27
  });
  document.dispatchEvent(evt);
}
