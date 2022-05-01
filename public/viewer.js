const viewer = new Cesium.Viewer("cesiumContainer", {
  shouldAnimate: true,
});
viewer.dataSources.add(
  // get czml file for display
  Cesium.CzmlDataSource.load("/simple.czml")
);