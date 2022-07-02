const satelliteInputs = document.forms['satelliteInputs']
console.log('hello world')
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
        'Content-Type':'application/json'
    });
    const body = JSON.stringify({walkerParams:{i:i, t:t,p:p,alt:alt,f:f, dist_threshold:dist_threshold}})
    fetch('/satellite',{
        method:'POST',
        headers:headers,
        body:body
    })
    .then(response => response.json())
    .then((data)=> {
        const { czmlId } = data;
        getCzmlatInterval(czmlId);
    })
}

const getCzmlatInterval = (id) => {
    const intervalId = setInterval(()=>{
        fetch(`/jobs/${id}`)
        .then(response => response.json())
        .then((data)=>{
            const { finishedProcessing } = data
            if(finishedProcessing){        
                
                let { czmlData:czml } = data
                czml = JSON.parse(czml)
                // console.log(czml)
                Cesium.CzmlDataSource.load(czml)
                .then(data =>{
                        viewer.dataSources.add(data)
                });
                clearInterval(intervalId)
            }else{
                console.log('waiting')
            }
        })
    },2500)
}