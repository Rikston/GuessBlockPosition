let gbp = null;
let levels = null;
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
      onShow: function(result) {
        window["rightAnswer"].textContent = result.right;
        window["wrongAnswer"].textContent = result.wrong;
        window["selected"].textContent = result.selected;
      },
      onEqual: function() {
        setTimeout(function() {
          levels.next();
        }, 500);
      }
    });
    levels = new TableLevel({
      numberLevel: 5,
      whatDoOnLevel: {
        1: function() {
          GuessBlockPosition.GeneratePattern(gbp);
          setTimeout(function() {
            gbp.hide();
          }, 1000);
        },
        2: function() {
          GuessBlockPosition.GeneratePattern(gbp);
          setTimeout(function() {
            gbp.hide();
          }, 1000);
        },
        3: function() {
          GuessBlockPosition.GeneratePattern(gbp);
          setTimeout(function() {
            gbp.hide();
          }, 1000);
        },
        4: function() {
          GuessBlockPosition.GeneratePattern(gbp);
          setTimeout(function() {
            gbp.hide();
          }, 1000);
        }
      },
      onNext: function(t) {
        if (gbp.isRight) t.now.right();
        else t.now.wrong();
      }
    });
    rightSide.appendChild(levels.node);
    gbp.show();
    setTimeout(function() {
      gbp.hide();
    }, 1000);
  });
  modalWindow.addEventListener("transitionend", function(e) {
    if (e.target == this) {
      this.style.display = "none";
    }
  });
});
