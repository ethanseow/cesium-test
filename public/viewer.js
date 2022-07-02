Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZDJlZjUzOC05NTk5LTRlNjEtYjQzZS00YWM5N2ZiYWIyNDUiLCJpZCI6OTc5ODQsImlhdCI6MTY1NTQ4NDU5OX0.kwtnbKrsGyQq2bq1C0st-oyXj8yBPhS42LBliNP-F14'

const viewer = new Cesium.Viewer("cesiumContainer", {
  shouldAnimate: true,
});



const defaultDataSource = Cesium.CzmlDataSource.load("/simple.czml")
viewer.dataSources.add(
  defaultDataSource
);