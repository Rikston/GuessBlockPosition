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
      selector: "gbp"
    });
    gbp.check();
    setTimeout(function() {
      gbp.check();
    }, 1000);
  });
  modalWindow.addEventListener("transitionend", function(e) {
    if (e.target == this) {
      this.style.display = "none";
    }
  });
});
