import simple from '/sat-vis-design/js/simple.js'
// helpers and constants
const D = document;

let $loading = D.getElementById('loadingScreen')
let $errorScreen = D.getElementById('errorScreen')

let $commThresh = D.getElementById('commThreshSlider')
let $conicSensor = D.getElementById('conicSensorSlider')
let $gsThresh = D.getElementById('gsThreshSlider')

let $IWalker = D.getElementById('IWalker')
let $TWalker = D.getElementById('TWalker')
let $PWalker = D.getElementById('PWalker')
let $FWalker = D.getElementById('FWalker')
let $AltWalker = D.getElementById('AltWalker')

let $propDur = D.getElementById('propDur')
let $calendarField = D.getElementById('calendarField')

let $groundStationField = D.getElementById('groundStationField')

let $commCheckBox = D.getElementById('commCheckBox')
let $conicCheckBox = D.getElementById('conicCheckBox')
let $gsCheckBox = D.getElementById('gsCheckBox')

let $submitButton = D.getElementById('submitButton')

let $errorMessage = D.getElementById('errorMessage')



Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZDJlZjUzOC05NTk5LTRlNjEtYjQzZS00YWM5N2ZiYWIyNDUiLCJpZCI6OTc5ODQsImlhdCI6MTY1NTQ4NDU5OX0.kwtnbKrsGyQq2bq1C0st-oyXj8yBPhS42LBliNP-F14'
let viewer = new Cesium.Viewer("cesiumContainer", {
        shouldAnimate: true,
})
const defaultDataSource = Cesium.CzmlDataSource.load(simple)

const parseGroundStations = (text) => {
    const regex = /-?[-0-9]+(\.)?[-0-9]+/g
    const coords = text.match(regex)
    let ret = []
    for(let i = 0; i < coords.length;i +=2 ){
        ret.push([parseInt(coords[i]),parseInt(coords[i+1])])
    }
    return ret
}



// application state
let isLoading = false
let missingWalkerInputs = []
let errors = {
    missingWalkerInputs:0,
    invalidGroundStations:0,
}
const errorTypes = {
    missingWalkerInputs:'All walker inputs must be completed',
    invalidGroundStations:'Ground stations are out of the range of -90 to 90 for latitude and -180 to 180 for longitude'
}
let areGSInbounds = true;
let hasErrors = false;
let isMissingWalkerInputs = false;


// getters and setters
const getCommThreshValue = () => parseInt($commThresh.value)
const getConicSensorValue = () => parseInt($conicSensor.value)
const getGsThreshValue = () => parseInt($gsThresh.value)
const getIWalkerValue = () => parseInt($IWalker.value)
const getTWalkerValue = () => parseInt($TWalker.value)
const getPWalkerValue = () => parseInt($PWalker.value)
const getFWalkerValue = () => parseInt($FWalker.value)
const getAltWalkerValue = () => parseInt($AltWalker.value)
const getPropDur = () => parseInt($propDur.value)
const getCalendarField = () => $calendarField.value
const getGroundStationField = () => $groundStationField.value
const isCommChecked = () => $commCheckBox.checked
const isConicChecked = () => $conicCheckBox.checked
const isGSChecked = () => $gsCheckBox.checked


// event handlers and related functions
const generateJson = () => {
    const groundStationsText = getGroundStationField()
    const groundStations = parseGroundStations(groundStationsText)
    let IWalker = getIWalkerValue()
    let TWalker = getTWalkerValue()
    let PWalker = getPWalkerValue()
    let FWalker = getFWalkerValue()
    let AltWalker = getAltWalkerValue()
    let propDur = getPropDur()
    let calendarField = getCalendarField()
    let commThresh = getCommThreshValue()
    let gsThresh = getGsThreshValue()
    let conicSensor = getConicSensorValue()
    if(!isCommChecked()){
        commThresh = null
    }
    if(!isGSChecked()){
        gsThresh = null
    }
    if(!isConicChecked()){
        conicSensor = null
    }
    let json = {
        i:IWalker,
        t:TWalker,
        p:PWalker,
        f:FWalker,
        alt:AltWalker,
        prop_dur:propDur,
        time:calendarField,
        dist_threshold:commThresh,
        elev_threshold:gsThresh,
        conicSensorAngle:conicSensor,
        GS_pos:groundStations
    }
    return json
}

const acceptableWalkerFields = () => {
    let IWalker = getIWalkerValue()
    let TWalker = getTWalkerValue()
    let PWalker = getPWalkerValue()
    let FWalker = getFWalkerValue()
    let AltWalker = getAltWalkerValue()
    const array = [IWalker,TWalker,PWalker,FWalker,AltWalker] 
    return !(array.some((elem)=> Number.isNaN(elem)))
}

const acceptableGS = () => {
    const groundStationsText = getGroundStationField()
    const groundStations = parseGroundStations(groundStationsText)
    for(let gs of groundStations){
        if(gs[0] < -90 || gs[0] > 90 || gs[1] < -180 || gs[1] > 180){
            return false;
        }
    }
    return (isGSChecked() && groundStations.length != 0)
}

const delay = async (ms) => {
    return await new Promise(resolve => setTimeout(resolve,ms))
}
const toggleLoading = () => {
    isLoading = !isLoading
}

const getCzmlFromJson = async (json) => {
	const body = JSON.stringify({walkerParams:json})
    console.log(`this is body:${body}`)
    const response = await fetch('/satellite',{
        method:'POST',
        headers:new Headers({'Content-Type':'application/json'}),
        body:body
    })
    const getCzmlAtInterval = async (id) => {
        return await new Promise(resolve => {
            const intervalId = setInterval(() => {
                fetch(`/jobs/${id}`)
                .then(response => response.json())
                .then((data) => {
                    const { finishedProcessing } = data
                    if(finishedProcessing){
                        console.log(data)
                        let { czmlData:czml } = data
                        czml = JSON.parse(czml)                
                        resolve(czml)
                        clearInterval(intervalId)
 
                    }else{
                        console.log('waiting')
                    }
                })
            }
            ,2500)
        })
    }
    const { czmlId } = await response.json()
    const czmlData = await getCzmlAtInterval(czmlId)
    return czmlData
}

const clearErrors = () => {
    isLoading = false
    missingWalkerInputs = []
    errors = []
    areGSInbounds = true;
    hasErrors = false;
    isMissingWalkerInputs = false;
}

const checkForErrors = () => {
    $('#hiddenSubmit').trigger('click');
    const groundStationsText = getGroundStationField()
    const groundStations = parseGroundStations(groundStationsText)

    for(let gs of groundStations){
        if(gs[0] < -90 || gs[0] > 90 || gs[1] < -180 || gs[1] > 180){
            console.log('out of bounds error');
            //let gsField = document.getElementById('groundStationField');
            //gsField.style.border = '2px solid red';
            errors.invalidGroundStations = 1
            areGSInbounds = false;
            hasErrors = true;
            break;
        }
    }

    const inputFields = $('.walkerInputs .walkerInput input')
    //console.log(inputFields)
    for(let input of inputFields){
        //console.log(input.value);
        if(isNaN(parseInt(input.value))){
            console.log('missing input')
            //input.style.border = '1px solid red'
            errors.missingWalkerInputs = 1;
            missingWalkerInputs.push(input)
            isMissingWalkerInputs = true
            hasErrors = true;
        }
    }
    //if(!acceptableGS()){ errors.push(errorTypes.invalidGroundStations) }
    //if(!acceptableWalkerFields()) { errors.push(errorTypes.missingWalkerInputs) }
}

const onSubmit = async () => {
    if(isLoading){ return }
    clearErrors()
    checkForErrors()
    console.log(`hasErrors is:${hasErrors}`)
    if(hasErrors){ return }
    viewer.dataSources.removeAll()
    toggleLoading()
    display()
    /*
    await delay(2000);
    */
    console.log('running')
    const json = generateJson()
    const czmlData = await getCzmlFromJson(json)
    const data = await Cesium.CzmlDataSource.load(czmlData)
    await viewer.dataSources.add(data)
    
    toggleLoading()
    display()
}

const display = () => {
    let errorString = '<h3>You have the following errors:</h3>'
    for(let error in errors){
        if(errors[error] == 1){
            errorString += '</br>' + errorTypes[error] + '</br>'
        }
    }
    $errorMessage.innerHTML = errorString;


    if(isMissingWalkerInputs){
        for(let walkerInput of missingWalkerInputs){
            walkerInput.style.border = '1px solid red';
        }        
    }else{
        const inputFields = $('.walkerInputs .walkerInput input')
        for(let input of inputFields){
            input.style.border = '0px solid red'
        }
    }


    let gsField = document.getElementById('groundStationField');
    gsField.style.border = (areGSInbounds ? '0px solid red' : '2px solid red');

    $loading.style.display = (isLoading ? 'flex':'none');
    $errorScreen.style.display = (hasErrors ? 'flex' : 'none')

    
}

const toggleHelper = () => {
    
}

// event handler bindings
$('#submitButton').on('click', ()=>{
    onSubmit()
    display()
})

$('#ISQuestion').on('click',()=> {
    toggleHelper()
})

$('.walkerInputs').on('submit',(e)=>e.preventDefault())

// initial setup
viewer.dataSources.add(
    defaultDataSource
);

$IWalker.value = "60"
$TWalker.value = "6"
$PWalker.value = "2"
$FWalker.value = "1"
$AltWalker.value = "600"
$propDur.value ="1"
$groundStationField.value = '[[10,10],[40,40],[60,60],[100,100],[150,150]]'

var i = 0;
var txt = 'Visualize the possibilities';
var speed = 50;

function typeWriter() {
    setTimeout(()=>{
        if (i < txt.length) {
            document.getElementById("demo").innerHTML += txt.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }, speed);
}

typeWriter()