var commThreshSlider = document.getElementById('commThreshSlider')
var commThreshValue = document.getElementById('commThreshValue')

var conicSensorSlider = document.getElementById('conicSensorSlider')
var conicSensorValue = document.getElementById('conicSensorValue')

var gsThreshSlider = document.getElementById('gsThreshSlider')
var gsThreshValue = document.getElementById('gsThreshValue')


commThreshValue.innerHTML = commThreshSlider.value
conicSensorValue.innerHTML = conicSensorSlider.value
gsThreshValue.innerHTML = gsThreshSlider.value

commThreshSlider.oninput = () => {
    commThreshValue.innerHTML = commThreshSlider.value
}
conicSensorSlider.oninput = () => {
    conicSensorValue.innerHTML = conicSensorSlider.value
}
gsThreshSlider.oninput = () => {
    gsThreshValue.innerHTML = gsThreshSlider.value
}