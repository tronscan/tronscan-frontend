# leaflet-echarts
A plugin for leaflet to load echarts map and make BigData Visualization.
## 基于leaflet 扩展echarts，使ECharts的地图可以加到leaflet上

> 根据百度地图echarts的扩展改写，在事件联动这个地方以及echarts的容器与地图容器在拖动和缩放中的适应上耗费了很长时间，为了兼容echarts的map其他类型的数据又下了不少功夫。现在可以算是一个稍微完美的版本了。好的效果请在谷歌浏览器访问。~~偶尔拖拽会飘，建议拖拽的时候在没有echarts渲染数据的区域拖拽。~~ 貌似修复了！

> This is a beta version,so it would have some bugs,visit it by **chrome** will be better.	~~When you want to drag the map,drag on zhe basemap without echarts data.~~	It seems that i have solved this problem.

# [在线访问(Demo)](http://wandergis.github.io/leaflet-echarts)
# [Online Demo(Not in china?Visit this!)](http://wandergis.github.io/leaflet-echarts/index-en.html) 

# 使用方法（Usage）

1. Confirm you have import `leaflet` first, 引入leaflet的js和css库自然不用说 
2. Import `eaflet-echarts.js` ,可以通过npm安装，输入`npm install leaflet-echarts` 即可
3. Import `echarts.source.js` under directory `lib` 引入lib目录下的`echarts.source.js`文件
4. As you can use this plugin like this,按照下面的方法使用

	```
		var overlay = new L.echartsLayer(map, echarts);
    	var chartsContainer=overlay.getEchartsContainer();
    	var myChart=overlay.initECharts(chartsContainer);
    	var option={};//这里跟百度echarts的map的option一样,the option is same as echarts map
    	overlay.setOption(option);
   	 ```
5. If you don't konw how to use this plugin,hava a look at `/examples/index.html`,如果你不会用，看看examples目录下的`index.html` 

# 截图示例

![](https://raw.githubusercontent.com/wandergis/leaflet-echarts/master/examples/demo.gif)

![](https://raw.githubusercontent.com/wandergis/leaflet-echarts/master/examples/demo2.gif)

# 参考

>[https://github.com/ecomfe/echarts](https://github.com/ecomfe/echarts)
