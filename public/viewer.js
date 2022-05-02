const viewer = new Cesium.Viewer("cesiumContainer", {
  shouldAnimate: true,
});
const defaultDataSource = Cesium.CzmlDataSource.load("/simple.czml")
viewer.dataSources.add(
  defaultDataSource
);