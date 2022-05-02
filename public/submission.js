const satelliteInputs = document.forms['satelliteInputs']

satelliteInputs.onsubmit = (e) => {
    e.preventDefault()
    // change dummy variables to actual data later
    const dummy1 = satelliteInputs.elements['dummy1'].value
    const dummy2 = satelliteInputs.elements['dummy2'].value
    const dummy3 = satelliteInputs.elements['dummy3'].value

    // think about fetch and how the site would update its simple.czml file
    viewer.dataSources.removeAll()

}