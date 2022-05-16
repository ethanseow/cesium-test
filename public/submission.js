const satelliteInputs = document.forms['satelliteInputs']

satelliteInputs.onsubmit = (e) => {
    e.preventDefault()
    // change dummy variables to actual data later
    const dummy1 = satelliteInputs.elements['dummy1'].value
    const dummy2 = satelliteInputs.elements['dummy2'].value
    const dummy3 = satelliteInputs.elements['dummy3'].value

    // think about fetch and how the site would update its simple.czml file
    viewer.dataSources.removeAll()
    const headers = new Headers({
        'Content-Type':'application/json',
    });
    const body = JSON.stringify({dummy1:dummy1,dummy2:dummy2,dummy3:dummy3})
    fetch('/satellite',{
        method:'POST',
        headers:headers,
        body:body
    })
    .then(response => response.json())
    .then((data)=> {
        console.log(data)
        //const newCzml = Cesium.CzmlDataSource.load(data.czml);
        //viewer.dataSources.add(newCzml);
    })
}