const viewer = new Cesium.Viewer("cesiumContainer", {
  shouldAnimate: true,
});
Sandcastle.addDefaultToolbarButton("Satellites", function () {
  viewer.dataSources.add(
    // get czml file for display
    Cesium.CzmlDataSource.load("../SampleData/simple.czml")
  );

  viewer.camera.flyHome(0);
});


Sandcastle.addToolbarButton("Vehicle", function () {
  viewer.dataSources.add(
    Cesium.CzmlDataSource.load("../SampleData/Vehicle.czml")
  );

  viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-116.52, 35.02, 95000),
    orientation: {
      heading: 6,
    },
  });
});

Sandcastle.reset = function () {
  viewer.dataSources.removeAll();
};
