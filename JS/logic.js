let gbp = null;
let counters = null;
window.addEventListener("load", function() {
  counters = Counter.ReplaceAllCounter("counter");
  start.addEventListener("click", function() {
    modalWindow.style.opacity = 0;
    gbp = new GuessBlockPosition({
      rows: counters.rows.Value,
      cols: counters.columns.Value,
      pattern: GuessBlockPosition.GeneratePattern(
        counters.rows.Value,
        counters.columns.Value
      ),
      selector: "gbp",
      onCheck: function(result) {
        window["rightAnswer"].textContent = result.right;
        window["wrongAnswer"].textContent = result.wrong;
        window["selected"].textContent = result.selected;
      }
    });
    gbp.check();
    setTimeout(function() {
      let result = gbp.check();
    }, 1000);
  });
  modalWindow.addEventListener("transitionend", function(e) {
    if (e.target == this) {
      this.style.display = "none";
    }
  });
});
