const satelliteInputs = document.forms['satelliteInputs']

satelliteInputs.onsubmit = (e) => {
    e.preventDefault()
    // change dummy variables to actual data later
    const i = satelliteInputs.elements['i'].value
    const p = satelliteInputs.elements['p'].value
    const t = satelliteInputs.elements['t'].value
    const alt = satelliteInputs.elements['alt'].value
    const f = satelliteInputs.elements['f'].value
    const dist_threshold = satelliteInputs.elements['dist_threshold'].value

    // think about fetch and how the site would update its simple.czml file
    viewer.dataSources.removeAll()
    const headers = new Headers({
        'Content-Type':'application/json',
    });
    const body = JSON.stringify({walkerParams:{i:i, t:t,p:p,alt:alt,f:f, dist_threshold:dist_threshold}})
    fetch('/satellite',{
        method:'POST',
        headers:headers,
        body:body
    })
    .then(response => response.json())
    .then((data)=> {
        console.log(data)
        const newCzml = Cesium.CzmlDataSource.load(data.czml);
        viewer.dataSources.add(newCzml);
    })
}