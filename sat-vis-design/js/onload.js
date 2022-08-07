import simple from '/sat-vis-design/js/simple.js'
// helpers and constants
const D = document;

let $loading = D.getElementById('loadingScreen')

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


Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZDJlZjUzOC05NTk5LTRlNjEtYjQzZS00YWM5N2ZiYWIyNDUiLCJpZCI6OTc5ODQsImlhdCI6MTY1NTQ4NDU5OX0.kwtnbKrsGyQq2bq1C0st-oyXj8yBPhS42LBliNP-F14'
let viewer = new Cesium.Viewer("cesiumContainer", {
        shouldAnimate: true,
})
const defaultDataSource = Cesium.CzmlDataSource.load(simple)

const parseGroundStations = (text) => {
    const regex = /[-0-9]+(\.)?[-0-9]+/g
    const coords = text.match(regex)
    let ret = []
    for(let i = 0; i < coords.length;i +=2 ){
        ret.push([parseInt(coords[i]),parseInt(coords[i+1])])
    }
    return ret
}



// application state
let isLoading = false

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
    return !([IWalker,TWalker,PWalker,FWalker,AltWalker].some((elem)=> elem === NaN))
}

const acceptableGS = () => {
    const groundStationsText = getGroundStationField()
    const groundStations = parseGroundStations(groundStationsText)
    return (isGSChecked && groundStations.length != 0)
}

const delay = async (ms) => {
    return await new Promise(resolve => setTimeout(resolve,ms))
}
const toggleLoading = () => {
    isLoading = !isLoading
    $loading.style.display = (isLoading ? 'flex':'none');
}

const getCzmlFromJson = async (json) => {
    const body = JSON.stringify({walkerParams:json})
    console.log(body)
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

const onSubmit = async () => {
    viewer.dataSources.removeAll()
    toggleLoading()
    const json = generateJson()
    const czmlData = await getCzmlFromJson(json)
    const data = await Cesium.CzmlDataSource.load(czmlData)
    await viewer.dataSources.add(data)
    toggleLoading()
}

// event handler bindings
$('#submitButton').on('click', ()=>{
    onSubmit()
})

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