const d3 = require("d3");

var chordMatrix = function () {

  var _matrix = [], dataStore = [], _id = 0, objs = [], entry = {};
  var matrixIndex = [], indexHash = {};
  var chordLayout, layoutCache;

  var filter = function () {};
  var reduce = function () {};

  var matrix = {};

  matrix.update = function () {
    _matrix = [], objs = [], entry = {};

    layoutCache = {groups: {}, chords: {}};

    this.groups().forEach(function (group) {
      layoutCache.groups[group._id] = {
        startAngle: group.startAngle,
        endAngle: group.endAngle
      };
    });

    this.chords().forEach(function (chord) {
      layoutCache.chords[chordID(chord)] = {
        source: {
          _id: chord.source._id,
          startAngle: chord.source.startAngle,
          endAngle: chord.source.endAngle
        },
        target: {
          _id: chord.target._id,
          startAngle: chord.target.startAngle,
          endAngle: chord.target.endAngle
        }
      };
    });

    matrixIndex = Object.keys(indexHash);

    for (var i = 0; i < matrixIndex.length; i++) {
      if (!_matrix[i]) {
        _matrix[i] = [];
      }
      for (var j = 0; j < matrixIndex.length; j++) {
        objs = dataStore.filter(function (obj) {
          return filter(obj, indexHash[matrixIndex[i]], indexHash[matrixIndex[j]]);
        });
        entry = reduce(objs, indexHash[matrixIndex[i]], indexHash[matrixIndex[j]]);
        entry.valueOf = function () { return +this.value };
        _matrix[i][j] = entry;
      }
    }
    chordLayout.matrix(_matrix);
    return _matrix;
  };

  matrix.data = function (data) {
    dataStore = data;
    return this;
  };

  matrix.filter = function (func) {
    filter = func;
    return this;
  };

  matrix.reduce = function (func) {
    reduce = func;
    return this;
  };

  matrix.layout = function (d3_chordLayout) {
    chordLayout = d3_chordLayout;
    return this;
  };

  matrix.groups = function () {
    return chordLayout.groups().map(function (group) {
      group._id = matrixIndex[group.index];
      return group;
    });
  };

  matrix.chords = function () {
    return chordLayout.chords().map(function (chord) {
      chord._id = chordID(chord);
      chord.source._id = matrixIndex[chord.source.index];
      chord.target._id = matrixIndex[chord.target.index];
      return chord;
    });
  };

  matrix.addKey = function (key, data) {
    if (!indexHash[key]) {
      indexHash[key] = {name: key, data: data || {}};
    }
  };

  matrix.addKeys = function (props, fun) {
    for (var i = 0; i < dataStore.length; i++) {
      for (var j = 0; j < props.length; j++) {
        this.addKey(dataStore[i][props[j]], fun ? fun(dataStore[i], props[j]):{});
      }
    }
    return this;
  };

  matrix.resetKeys = function () {
    indexHash = {};
    return this;
  };

  function chordID(d) {
    var s = matrixIndex[d.source.index];
    var t = matrixIndex[d.target.index];
    return (s < t) ? s + "__" + t: t + "__" + s;
  }

  matrix.groupTween = function (d3_arc) {
    return function (d, i) {
      var tween;
      var cached = layoutCache.groups[d._id];

      if (cached) {
        tween = d3.interpolateObject(cached, d);
      } else {
        tween = d3.interpolateObject({
          startAngle:d.startAngle,
          endAngle:d.startAngle
        }, d);
      }

      return function (t) {
        return d3_arc(tween(t));
      };
    };
  };

  matrix.chordTween = function (d3_path) {
    return function (d, i) {
      var tween, groups;
      var cached = layoutCache.chords[d._id];

      if (cached) {
        if (d.source._id !== cached.source._id){
          cached = {source: cached.target, target: cached.source};
        }
        tween = d3.interpolateObject(cached, d);
      } else {
        if (layoutCache.groups) {
          groups = [];
          for (var key in layoutCache.groups) {
            cached = layoutCache.groups[key];
            if (cached._id === d.source._id || cached._id === d.target._id) {
              groups.push(cached);
            }
          }
          if (groups.length > 0) {
            cached = {source: groups[0], target: groups[1] || groups[0]};
            if (d.source._id !== cached.source._id) {
              cached = {source: cached.target, target: cached.source};
            }
          } else {
            cached = d;
          }
        } else {
          cached = d;
        }

        tween = d3.interpolateObject({
          source: {
            startAngle: cached.source.startAngle,
            endAngle: cached.source.startAngle
          },
          target: {
            startAngle: cached.target.startAngle,
            endAngle: cached.target.startAngle
          }
        }, d);
      }

      return function (t) {
        return d3_path(tween(t));
      };
    };
  };

  matrix.read = function (d) {
    var g, m = {};

    if (d.source) {
      m.sname  = d.source._id;
      m.sdata  = d.source.value;
      m.svalue = +d.source.value;
      m.stotal = _matrix[d.source.index].reduce(function (k, n) { return k + n; }, 0);
      m.tname  = d.target._id;
      m.tdata  = d.target.value;
      m.tvalue = +d.target.value;
      m.ttotal = _matrix[d.target.index].reduce(function (k, n) { return k + n; }, 0);
    } else {
      g = indexHash[d._id];
      m.gname  = g.name;
      m.gdata  = g.data;
      m.gvalue = d.value;
    }
    m.mtotal = _matrix.reduce(function (m1, n1) {
      return m1 + n1.reduce(function (m2, n2) { return m2 + n2; }, 0);
    }, 0);
    return m;
  };

  return matrix;
};

export default chordMatrix;
