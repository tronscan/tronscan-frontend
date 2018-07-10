define([
  "dojo/_base/declare",
  "dojo/_base/lang","esri/geometry/Point","esri/geometry/ScreenPoint"], function (declare, lang,Point,ScreenPoint) {
  return declare("EchartsLayer", null, {
    name: "EchartsLayer",
    _map: null,
    _ec: null,
    _geoCoord: [],
    _option:null,
    _mapOffset: [0, 0],
    constructor: function (map, ec) {
      this._map = map;
      var div = this._echartsContainer = document.createElement('div');
      div.style.position = 'absolute';
      div.style.height = map.height + 'px';
      div.style.width = map.width + 'px';
      div.style.top = 0;
      div.style.left = 0;
      map.__container.appendChild(div);
      this._init(map, ec);
    },
    _init: function(map, ec) {
      var self = this;
      self._map = map;
      //self._map.spatialReference=new SpatialReference(3857);
      //初始化mapoverlay
      /**
       * 获取echarts容器
       *
       * @return {HTMLElement}
       * @public
       */
      self.getEchartsContainer = function() {
        return self._echartsContainer;
      };

      /**
       * 获取map实例
       *
       * @return {map.Map}
       * @public
       */
      self.getMap = function() {
        return self._map;
      };
      /**
       * 经纬度转换为屏幕像素
       *
       * @param {Array.<number>} geoCoord  经纬度
       * @return {Array.<number>}
       * @public
       */
      self.geoCoord2Pixel = function(geoCoord) {
        var point = new Point(geoCoord[0], geoCoord[1]);
        var pos = self._map.toScreen(point);
        return [pos.x, pos.y];
      };

      /**
       * 屏幕像素转换为经纬度
       *
       * @param {Array.<number>} pixel  像素坐标
       * @return {Array.<number>}
       * @public
       */
      self.pixel2GeoCoord = function(pixel) {
        var point = self._map.toMap(new ScreenPoint(pixel[0], pixel[1]));
        return [point.lng, point.lat];
      };

      /**
       * 初始化echarts实例
       *
       * @return {ECharts}
       * @public
       */
      self.initECharts = function() {
        self._ec = ec.init.apply(self, arguments);
        self._bindEvent();
        self._addMarkWrap();
        return self._ec;
      };

      // addMark wrap for get position from baidu map by geo location
      // by kener at 2015.01.08
      self._addMarkWrap = function() {
        function _addMark(seriesIdx, markData, markType) {
          var data;
          if (markType == 'markPoint') {
            var data = markData.data;
            if (data && data.length) {
              for (var k = 0, len = data.length; k < len; k++) {
                if (!(data[k].name && this._geoCoord.hasOwnProperty(data[k].name))) {
                  data[k].name = k + 'markp';
                  self._geoCoord[data[k].name] = data[k].geoCoord;
                }
                self._AddPos(data[k]);
              }
            }
          } else {
            data = markData.data;
            if (data && data.length) {
              for (var k = 0, len = data.length; k < len; k++) {
                if (!(data[k][0].name && this._geoCoord.hasOwnProperty(data[k][0].name))) {
                  data[k][0].name = k + 'startp';
                  self._geoCoord[data[k][0].name] = data[k][0].geoCoord;
                }
                if (!(data[k][1].name && this._geoCoord.hasOwnProperty(data[k][1].name))) {
                  data[k][1].name = k + 'endp';
                  self._geoCoord[data[k][1].name] = data[k][1].geoCoord;
                }
                self._AddPos(data[k][0]);
                self._AddPos(data[k][1]);
              }
            }
          }
          self._ec._addMarkOri(seriesIdx, markData, markType);
        }

        self._ec._addMarkOri = self._ec._addMark;
        self._ec._addMark = _addMark;
      };

      /**
       * 获取ECharts实例
       *
       * @return {ECharts}
       * @public
       */
      self.getECharts = function() {
        return self._ec;
      };

      /**
       * 获取地图的偏移量
       *
       * @return {Array.<number>}
       * @public
       */
      self.getMapOffset = function() {
        return self._mapOffset;
      };

      /**
       * 对echarts的setOption加一次处理
       * 用来为markPoint、markLine中添加x、y坐标，需要name与geoCoord对应
       *
       * @public
       * @param option
       * @param notMerge
       */
      self.setOption = function(option, notMerge) {
        self._option = option;
        var series = option.series || {};

        // 记录所有的geoCoord
        for (var i = 0, item; item = series[i++];) {
          var geoCoord = item.geoCoord;
          if (geoCoord) {
            for (var k in geoCoord) {
              self._geoCoord[k] = geoCoord[k];
            }
          }
        }

        // 添加x、y
        for (var i = 0, item; item = series[i++];) {
          var markPoint = item.markPoint || {};
          var markLine = item.markLine || {};

          var data = markPoint.data;
          if (data && data.length) {
            for (var k = 0, len = data.length; k < len; k++) {
              if (!(data[k].name && this._geoCoord.hasOwnProperty(data[k].name))) {
                data[k].name = k + 'markp';
                self._geoCoord[data[k].name] = data[k].geoCoord;
              }
              self._AddPos(data[k]);
            }
          }

          data = markLine.data;
          if (data && data.length) {
            for (var k = 0, len = data.length; k < len; k++) {
              if (!(data[k][0].name && this._geoCoord.hasOwnProperty(data[k][0].name))) {
                data[k][0].name = k + 'startp';
                self._geoCoord[data[k][0].name] = data[k][0].geoCoord;
              }
              if (!(data[k][1].name && this._geoCoord.hasOwnProperty(data[k][1].name))) {
                data[k][1].name = k + 'endp';
                self._geoCoord[data[k][1].name] = data[k][1].geoCoord;
              }
              self._AddPos(data[k][0]);
              self._AddPos(data[k][1]);
            }
          }
        }

        self._ec.setOption(option, notMerge);
      };

      /**
       * 增加x、y坐标
       *
       * @param {Object} obj  markPoint、markLine data中的项，必须有name
       * @param {Object} geoCoord
       */
      self._AddPos = function(obj) {

        var coord = self._geoCoord[obj.name];
        var pos = self.geoCoord2Pixel(coord);
        obj.x = pos[0]; //- self._mapOffset[0];
        obj.y = pos[1]; //- self._mapOffset[1];
      };

      /**
       * 绑定地图事件的处理方法
       *
       * @private
       */
      self._bindEvent = function() {
        self._map.on('zoom-end', function (e) {
          self.setOption(self._option);
        });
        self._map.on('zoom-start', function (e) {
          self._ec.clear();
        });
        self._map.on('pan', function (e) {
          self._ec.clear();
        });
        self._map.on('pan-end', function (e) {
          self.setOption(self._option);
        });

        self._ec.getZrender().on('dragstart', function (e) {
          self._map.disablePan();
          //self._ec.clear();
        });
        self._ec.getZrender().on('dragend', function (e) {
          self._map.enablePan();
          //self.setOption(self._option);
        });
      };

    }

  });
});
  