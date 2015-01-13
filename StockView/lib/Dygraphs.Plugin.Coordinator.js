/**
 * Created by jian on 13/01/2015.
 */
Dygraph.Plugins.Coordinator = (function() {

  "use strict";

  /**
   * Create a new instance.
   *
   * @constructor
   */
  var Coordinator = function() {
      
  };

  Coordinator.prototype.toString = function() {
    return 'Coordinator Plugin';
  };

  Coordinator.prototype.activate = function(g) {
    return {
      willDrawChart: this.willDrawChart
    };
  };

  Coordinator.prototype.willDrawChart = function(e) {
    var g = e.dygraph;

  };

  Coordinator.prototype.destroy = function() {
      
  };

  return Coordinator;

})();
