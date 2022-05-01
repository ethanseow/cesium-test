const satelliteInputs = document.forms['satelliteInputs']

satelliteInputs.onsubmit = (e) => {
    e.preventDefault()
    console.log(satelliteInputs.elements)
}