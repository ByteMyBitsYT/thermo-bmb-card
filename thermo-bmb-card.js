/**
 * Thermo-BMB-Card v0.7
 * Custom frontend card for Home Assistant
 * Display and control temperature and humidity with animated icons
 * 
 * Author: Jason aKa Byte My Bits from the Internet
 * License: MIT
 */

class ThermoBmbCard extends HTMLElement {
  constructor() {
    super();
    this._hass = {};
    this.attachShadow({ mode: 'open' });
    this._render();
    this.config = {};
  }
_handleClick(node, actionConfig, entityId) {
  let e;
  // eslint-disable-next-line default-case
  switch (actionConfig.action) {
    case 'more-info': {
      e = new Event('hass-more-info', { composed: true });
      e.detail = { entityId };
      node.dispatchEvent(e);
      break;
    }
    case 'navigate': {
      if (!actionConfig.navigation_path) return;
      window.history.pushState(null, '', actionConfig.navigation_path);
      e = new Event('location-changed', { composed: true });
      e.detail = { replace: false };
      window.dispatchEvent(e);
      break;
    }
    case 'call-service': {
      if (!actionConfig.service) return;
      const [domain, service] = actionConfig.service.split('.', 2);
      const serviceData = { ...actionConfig.service_data };
      this._hass.callService(domain, service, serviceData); // Corrected line
      break; // Don't forget to include the 'break' statement
    }
  }
}

setConfig(config) {
  if (!config) {
    throw new Error('Invalid configuration');
  }
  this.config = Object.assign({}, config);
  this.config.critical = config.critical || 80;

  // Set default values for spin options
  this.config.spinlayer1 = config.spinlayer1 !== 'no';
  this.config.spinlayer2 = config.spinlayer2 !== 'no';
  this.config.spinlayer3 = config.spinlayer3 !== 'no';
  this.config.spinlayer4 = config.spinlayer4 !== 'no';
  this.config.spinlayer5 = config.spinlayer5 !== 'no';

  // Set Speed of the spinning icons
  this.config.speedlayer1 = parseInt(config.speedlayer1) || 200;
  this.config.speedlayer2 = parseInt(config.speedlayer2) || 150;
  this.config.speedlayer3 = parseInt(config.speedlayer3) || 60;
  this.config.speedlayer4 = parseInt(config.speedlayer4) || 250;
  this.config.speedlayer5 = parseInt(config.speedlayer5) || 500;

  // Set direction, normal or reverse, of the spinning icons
  this.config.directionlayer1 = config.directionlayer1 || 'normal';
  this.config.directionlayer2 = config.directionlayer2 || 'reverse';
  this.config.directionlayer3 = config.directionlayer3 || 'reverse';
  this.config.directionlayer4 = config.directionlayer4 || 'normal';
  this.config.directionlayer5 = config.directionlayer5 || 'normal';

// Set default values for flash options
this.config.flashlayer1 = config.flashlayer1 === 'yes';
this.config.flashlayer2 = config.flashlayer2 === 'yes';
this.config.flashlayer3 = config.flashlayer3 === 'yes';
this.config.flashlayer4 = config.flashlayer4 === 'yes';
this.config.flashlayer5 = config.flashlayer5 === 'yes';

  if (!this.config.temperature_sensor) {
    throw new Error('Required "temperature_sensor" missing.');
  }
  
  // Check if humidity_sensor and label are provided, if not, set them to empty strings
  this.config.humidity_sensor = this.config.humidity_sensor || '';
  this.config.label = this.config.label || '';
}

handlePopup(entityId) {
  const actionConfig = { action: 'more-info' };
  this._handleClick(this, actionConfig, entityId);
}
_render() {
  
  this.shadowRoot.innerHTML = `
  <style>
  :host {
    display: block;
    position: relative;


  }
  :host ha-card {
    padding: 50%;
  }    
  .container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .sensorsdata {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    


  } 
  .outer {
    position: absolute;
    overflow: hidden;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    filter: drop-shadow(0 0rem .9rem rgba(0, 0, 0, .6));
    color: var(--outer-icon-color);
    --mdc-icon-size: 100%;
  }
  .midoutrotate {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 60%;
    color: var(--innerlines-color);
    filter: invert(69%) sepia(94%) saturate(920%) hue-rotate(147deg) brightness(93%) contrast(93%);
    --mdc-icon-size: 100%;
  }
  .midrotate {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    color: var(--midrotate-icon-color);
    --mdc-icon-size: 100%;
  }
  .midpattern {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    color: #000000;
    filter: drop-shadow(0 0rem .4rem rgba(23, 255, 241, 1));
    opacity: 65%;
    --mdc-icon-size: 100%;
  }
  .innerlines {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    filter: drop-shadow(0 .3rem .5rem rgba(255, 255, 255, .4));
    color: var(--innerlines-color);
    --mdc-icon-size: 100%;
  }
.temperature {
  justify-content: center;
  font-size: var(--temperature-font-size, 1rem); /* Fallback to 1rem */
  color: #FFFFFF;
  font-family: sans-serif;
  height: var(--temperature-div-height);
  width: 100%;
  text-align: center;
  margin-top: var(--dynamic-margin-container);
  margin-bottom: var(--dynamic-margin-container);
  margin-right: var(--dynamic-margin-temperature);
  line-height: 100%;
}
.temperature-icon {
  position: relative;
  bottom: var(--dynamic-margin-container);
  right: var(--dynamic-margin-tempicon);        
  --mdc-icon-size: var(--temperature-icon-size, 5px);
  color: var(--outer-icon-color);
  padding: 0px 0px 0px 0px;
  }   
  .label {
    justify-content: center;
    font-size: var(--label-font-size, 1rem); /* Fallback to 1rem */
    color: #FFFFFF;
    font-family: sans-serif;
    font-synthesis: small-caps;
    height: var(--label-div-height, 5%);
    width: 100%;
    text-align: center;
    margin-top: var(--dynamic-margin-container);
    margin-bottom: var(--dynamic-margin-container);
    line-height: 100%;      
  }
  hr {
    justify-content: center;
    color: #FFFFFF;
    width: 22%;
    border: 1.5px solid #ffffff;
    opacity: 65%;
    margin-top: var(--dynamic-margin-container);
    margin-bottom: var(--dynamic-margin-container);
    line-height: 100%;
  }
  .humidity {
    justify-content: center;
    font-size: var(--humidity-font-size, 1rem); /* Fallback to 1rem */
    color: #FFFFFF;
    font-family: sans-serif;
    height: var(--humidity-div-height, 5%);
    width: 100%;
    text-align: center;
    margin-top: var(--dynamic-margin-humidity-top);
    margin-bottom: var(--dynamic-margin-container);
    line-height: 100%;
    margin-right: var(--dynamic-margin-humidity);
    }
    .humidity-icon {
      position: relative;
      bottom: var(--dynamic-margin-humitidy);
      right: var(--dynamic-margin-humidityicon);
      --mdc-icon-size: var(--humidity-icon-size, 5px);
      color: var(--innerlines-color);
      padding: 0px 0px 0px 0px;
      }  

  @keyframes rotate-center {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes blink {
    0% {
      opacity: 1;
    }
    25% {
      opacity: .5;
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: .5;
    }
    100% {
      opacity: 1;
    }
  }
</style>
<ha-card>
<div class="container">
  <div class="sensorsdata">
    <div class="temperature"></div>
    <hr>
    <div class="humidity"></div>
    <div class="label"></div>
  </div>
  <ha-icon icon="thr:therm-outer" class="outer"></ha-icon>
  <ha-icon icon="thr:therm-out-mid-rotate" class="midoutrotate"></ha-icon>
  <ha-icon icon="thr:therm-mid-rotate" class="midrotate"></ha-icon>
  <ha-icon icon="thr:therm-mid-pattern" class="midpattern"></ha-icon>
  <ha-icon icon="thr:therm-inner-lines" class="innerlines"></ha-icon>
</div>
</ha-card>
`;




  const tempElementInRender = this.shadowRoot.querySelector('.temperature');
  if (tempElementInRender) {
    tempElementInRender.addEventListener('click', () => this.handlePopup(this.config.temperature_sensor));
  }

  const humidityElementInRender = this.shadowRoot.querySelector('.humidity');
  if (humidityElementInRender) {
    humidityElementInRender.addEventListener('click', () => this.handlePopup(this.config.humidity_sensor));
  }
  const haCard = this.shadowRoot.querySelector('ha-card');
  if (haCard) {
    haCard.addEventListener('click', () => {
      this.handlePopup(this.config.temperature_sensor);
    });
  }
  this._updateData();

  const temperatureElement = this.shadowRoot.querySelector('.temperature');
  if (temperatureElement) {
    temperatureElement.addEventListener('click', () => this.handlePopup(this.config.temperature_sensor));
  }

  const humidityElement = this.shadowRoot.querySelector('.humidity');
  if (humidityElement) {
    humidityElement.addEventListener('click', () => this.handlePopup(this.config.humidity_sensor));
  }
}
async _updateData() {
  if (!this.config) {
    return;
  }  
//   const contentHeight = this.shadowRoot.querySelector('.container').offsetHeight;
//  this.style.height = `${contentHeight}px`;

  const temperatureSensor = this._hass.states[this.config.temperature_sensor];
  const humiditySensor = this._hass.states[this.config.humidity_sensor];

// Dynamic Control for custom --vARRGS
  // .temperature DIV Height from .container 
// Utility function to set styles
function setStyle(element, variable, size) {
  if (element && size) {
    element.style.setProperty(variable, `${size}px`);
  }
}

// Utility function to calculate size
function calculateSize(containerWidth, factor) {
  return containerWidth * factor;
}

const container = this.shadowRoot.querySelector('.container');
const containerWidth = container ? container.offsetWidth : 0;

// List of elements and their respective CSS variables and factors
const elements = [
  {selector: '.sensorsdata', variable: '--temperature-div-height', factor: 0.185},
  {selector: '.temperature', variable: '--temperature-font-size', factor: 0.24},
  {selector: '.temperature', variable: '--temperature-symbol-size', factor: 0.10},    
  {selector: '.temperature', variable: '--temperature-icon-size', factor: 0.1},    
  {selector: '.sensorsdata', variable: '--label-div-height', factor: 0.05},
  {selector: '.label', variable: '--label-font-size', factor: 0.07},
  {selector: '.sensorsdata', variable: '--humidity-div-height', factor: 0.11},
  {selector: '.humidity', variable: '--humidity-font-size', factor: 0.15},
  {selector: '.humidity', variable: '--humidity-symbol-size', factor: 0.05},    
  {selector: '.humidity', variable: '--humidity-icon-size', factor: 0.07},    
  {selector: '.sensorsdata', variable: '--hr-div-height', factor: 0.002},
  {selector: '.sensorsdata', variable: '--dynamic-margin-container', factor: 0.015},
  {selector: '.sensorsdata', variable: '--dynamic-margin-temperature', factor: 0.01},    
  {selector: '.sensorsdata', variable: '--dynamic-margin-humidity', factor: 0.05},   
  {selector: '.sensorsdata', variable: '--dynamic-margin-humidity-top', factor: -0.02},       
  {selector: '.sensorsdata', variable: '--dynamic-margin-tempicon', factor: -0.01},
  {selector: '.sensorsdata', variable: '--dynamic-margin-humidityicon', factor: 0.012}        
];

elements.forEach(el => {
  const element = this.shadowRoot.querySelector(el.selector);
  const size = calculateSize(containerWidth, el.factor);
  setStyle(element, el.variable, size);
});

const flashLayer1 = this.config.flashlayer1;
const flashLayer2 = this.config.flashlayer2;
const flashLayer3 = this.config.flashlayer3;
const flashLayer4 = this.config.flashlayer4;
const flashLayer5 = this.config.flashlayer5;

const speedLayer1 = this.config.speedlayer1 + 's';
const speedLayer2 = this.config.speedlayer2 + 's';
const speedLayer3 = this.config.speedlayer3 + 's';
const speedLayer4 = this.config.speedlayer4 + 's';
const speedLayer5 = this.config.speedlayer5 + 's';

const directionLayer1 = this.config.directionlayer1 || 'normal';
const directionLayer2 = this.config.directionlayer2 || 'reverse';
const directionLayer3 = this.config.directionlayer3 || 'reverse';
const directionLayer4 = this.config.directionlayer4 || 'normal';
const directionLayer5 = this.config.directionlayer5 || 'normal';

// Declare blinkLayer variables once
const blinkLayer1 = flashLayer1 ? 'blink 2s linear 0s infinite normal' : 'none';
const blinkLayer2 = flashLayer2 ? 'blink 2s linear 0s infinite normal' : 'none';
const blinkLayer3 = flashLayer3 ? 'blink 2s linear 0s infinite normal' : 'none';
const blinkLayer4 = flashLayer4 ? 'blink 2s linear 0s infinite normal' : 'none';
const blinkLayer5 = flashLayer5 ? 'blink 2s linear 0s infinite normal' : 'none';



// Check if temperatureSensor exists
if (temperatureSensor) {
  const temperatureValue = parseInt(temperatureSensor.state);
  const temperatureElement = this.shadowRoot.querySelector('.temperature');

  // Check if temperatureElement exists
  if (temperatureElement) {
    temperatureElement.innerHTML = `<ha-icon icon="mdi:thermometer" class="temperature-icon"></ha-icon>${temperatureValue}<span style="font-size: var(--temperature-symbol-size);">°F</span>`;
    const TempIcon = this.shadowRoot.querySelector('.temperature-icon');
    if (TempIcon) {
      TempIcon.style.setProperty('--outer-icon-color', getTemperatureColor(temperatureValue));
    }
    // Layer 1
    const outerIcon = this.shadowRoot.querySelector('.outer');
    if (outerIcon) {
      outerIcon.style.setProperty('--outer-icon-color', getTemperatureColor(temperatureValue));

      let criticalValue1 = this.config.critical || 80;
      const isTemperatureOverCritical1 = temperatureValue > criticalValue1;

      const spinLayer1 = this.config.spinlayer1 ? 'rotate-center ' + speedLayer1 + ' linear 0s infinite ' + directionLayer1 + ' none' : 'none';
      const blinkLayer1 = flashLayer1 && isTemperatureOverCritical1 ? 'blink 2s linear 0s infinite normal' : 'none';

      outerIcon.style.animation = [spinLayer1, blinkLayer1].filter(Boolean).join(', ');
    }
    // Layer 2
    const midoutrotate = this.shadowRoot.querySelector('.midoutrotate');
    if (midoutrotate) {
      midoutrotate.style.setProperty('--midoutrotate-icon-color', getTemperatureColor(temperatureValue));
    
      let criticalValue2 = this.config.critical || 80;
      const isTemperatureOverCritical2 = temperatureValue > criticalValue2;
    
      const spinLayer2 = this.config.spinlayer2 ? 'rotate-center ' + speedLayer2 + ' linear 0s infinite ' + directionLayer2 + ' none' : 'none';
      const blinkLayer2 = flashLayer2 && isTemperatureOverCritical2 ? 'blink 2s linear 0s infinite normal' : 'none';
    
      midoutrotate.style.animation = [spinLayer2, blinkLayer2].filter(Boolean).join(', ');
    }

    // Layer 3
    const midRotateIcon3 = this.shadowRoot.querySelector('.midrotate');
    if (midRotateIcon3) {
      midRotateIcon3.style.setProperty('--midrotate-icon-color', getTemperatureColor(temperatureValue));
    
      let criticalValue3 = this.config.critical || 80;
      const isTemperatureOverCritical3 = temperatureValue > criticalValue3;
    
      const flashLayer3 = this.config.flashlayer3; // Assuming you have configured flashLayer for layer 3
      const speedLayer3 = this.config.speedlayer3 + 's';
      const directionLayer3 = this.config.directionlayer3 || 'reverse';
      const spinLayer3 = this.config.spinlayer3 ? 'rotate-center ' + speedLayer3 + ' linear 0s infinite ' + directionLayer3 + ' none' : 'none';
      const blinkLayer3 = flashLayer3 && isTemperatureOverCritical3 ? 'blink 2s linear 0s infinite normal' : 'none';
    
      midRotateIcon3.style.animation = [spinLayer3, blinkLayer3].filter(Boolean).join(', ');
    }
    

    // Layer 4
    const midRotateIcon4 = this.shadowRoot.querySelector('.midpattern');
    if (midRotateIcon4) {
      midRotateIcon4.style.setProperty('--midrotate-icon-color', getTemperatureColor(temperatureValue));
    
      let criticalValue4 = this.config.critical || 80;
      const isTemperatureOverCritical4 = temperatureValue > criticalValue4;
    
      const flashLayer4 = this.config.flashlayer4; // Assuming you have configured flashLayer for layer 4
      const speedLayer4 = this.config.speedlayer4 + 's';
      const directionLayer4 = this.config.directionlayer4 || 'normal';
      const spinLayer4 = this.config.spinlayer4 ? 'rotate-center ' + speedLayer4 + ' linear 0s infinite ' + directionLayer4 + ' none' : 'none';
      const blinkLayer4 = flashLayer4 && isTemperatureOverCritical4 ? 'blink 2s linear 0s infinite normal' : 'none';
    
      midRotateIcon4.style.animation = [spinLayer4, blinkLayer4].filter(Boolean).join(', ');
    }
    

    // Layer 5
    const midRotateIcon5 = this.shadowRoot.querySelector('.innerlines');
    if (midRotateIcon5) {
      midRotateIcon5.style.setProperty('--midrotate-icon-color', getTemperatureColor(temperatureValue));
    
      let criticalValue5 = this.config.critical || 80;
      const isTemperatureOverCritical5 = temperatureValue > criticalValue5;
    
      const flashLayer5 = this.config.flashlayer5; // Assuming you have configured flashLayer for layer 5
      const speedLayer5 = this.config.speedlayer5 + 's';
      const directionLayer5 = this.config.directionlayer5 || 'normal';
      const spinLayer5 = this.config.spinlayer5 ? 'rotate-center ' + speedLayer5 + ' linear 0s infinite ' + directionLayer5 + ' none' : 'none';
      const blinkLayer5 = flashLayer5 && isTemperatureOverCritical5 ? 'blink 2s linear 0s infinite normal' : 'none';
    
      midRotateIcon5.style.animation = [spinLayer5, blinkLayer5].filter(Boolean).join(', ');
    }
  }

function getTemperatureColor(temperature) {
  if (temperature >= 120) {
    return '#ff0000';
  } else if (temperature >= 110) {
    return '#c33522';
  } else if (temperature >= 100) {
    return '#c36222';
  } else if (temperature >= 90) {
    return '#c38422';
  } else if (temperature >= 85) {
    return '#c1c322';
  } else if (temperature >= 80) {
    return '#a3c322';
  } else if (temperature >= 75) {
    return '#88c322';
  } else if (temperature >= 70) {
    return '#6ac322';
  } else if (temperature >= 65) {
    return '#38c322';
  } else if (temperature <= 60) {
    return '#22c366';
  } else if (temperature >= 55) {
    return '#22c384';
  } else if (temperature >= 50) {
    return '#22c3b2';
  } else if (temperature >= 45) {
    return '#22bdc3';
  } else if (temperature <= 40) {
    return '#229fc3';      
  } else {
    return '#ffffff';
  }
}
}



if (humiditySensor) {
  const humidityValue = parseInt(humiditySensor.state);
  const humidityElement = this.shadowRoot.querySelector('.humidity');
  if (humidityElement) {
    humidityElement.innerHTML = `<ha-icon icon="mdi:water-percent" class="humidity-icon"></ha-icon>${humidityValue}<span style="font-size: var(--humidity-symbol-size);">%</span>`;
  

  
      const innerLines = this.shadowRoot.querySelector('.innerlines');
      if (innerLines) {
        innerLines.style.setProperty('--innerlines-color', getHumidityColor(humidityValue));
      }
      const humidityicon = this.shadowRoot.querySelector('.humidity-icon');
      if (humidityicon) {
        humidityicon.style.setProperty('--innerlines-color', getHumidityColor(humidityValue));
      }
    }
  }

function getHumidityColor(humidity) {
  if (humidity >= 100) {
    return '#0000ff';
  } else if (humidity >= 90) {
    return '#090ffe';
  } else if (humidity >= 80) {
    return '#191efb';
  } else if (humidity >= 70) {
    return '#193efb';
  } else if (humidity >= 60) {
    return '#1638e5';
  } else if (humidity >= 50) {
    return '#1669e5';
  } else if (humidity >= 40) {
    return '#2870db';
  } else if (humidity >= 30) {
    return '#488aed';
  } else if (humidity >= 20) {
    return '#72a4ee';
  } else if (humidity <= 10) {
    return '#91bcfd';
  } else {
    return '#ffffff';
  }
}
const THR_ICONS_MAP = {

  "therm-mid-pattern": {
    "keywords": [],
    "path": "M20.88,14.05c-0.21,0.91-0.55,1.76-0.99,2.52l0.63-0.15c0.18-0.34,0.34-0.7,0.47-1.07c0.14-0.38,0.26-0.78,0.36-1.2c0.1-0.42,0.16-0.83,0.2-1.24l0,0l-0.45-0.37C21.07,13.04,21,13.55,20.88,14.05L20.88,14.05z M21.57,12.69c0.02-0.31,0.03-0.62,0.02-0.93l-0.5-0.41c0.02,0.32,0.03,0.64,0.02,0.97L21.57,12.69L21.57,12.69z M21.75,12.83L21.75,12.83l0,0.01c-0.04,0.45-0.11,0.9-0.21,1.35c-0.2,0.85-0.5,1.65-0.89,2.39l-0.89,0.21C19.01,18,18,19,16.83,19.73c-0.37,0.23-0.76,0.44-1.16,0.61l-0.33,0.85c-0.37,0.13-0.74,0.25-1.12,0.33l0,0.01l-0.01,0c-1.25,0.29-2.57,0.34-3.9,0.1l-0.48-0.78c-1.86-0.45-3.44-1.45-4.63-2.78l-0.91-0.05c-0.24-0.31-0.46-0.63-0.66-0.96l-0.01,0l0-0.01C3.38,16.66,3.17,16.25,3,15.84c-0.33-0.78-0.57-1.61-0.69-2.46l0.6-0.7c-0.07-0.89,0-1.81,0.21-2.72c0.21-0.92,0.55-1.77,1-2.54L3.89,6.52C4.11,6.2,4.35,5.89,4.6,5.59l0-0.01l0.01,0c0.3-0.35,0.63-0.68,0.98-0.98c0.64-0.56,1.35-1.03,2.12-1.4l0.85,0.35c1.65-0.68,3.51-0.88,5.38-0.47l0.77-0.49c0.38,0.11,0.75,0.24,1.11,0.39l0.01,0l0.01,0.01c0.44,0.18,0.86,0.4,1.26,0.64c0.73,0.44,1.38,0.97,1.96,1.57l-0.07,0.91c0.28,0.33,0.54,0.69,0.77,1.06c0.73,1.17,1.2,2.51,1.34,3.92l0.71,0.58C21.8,12.05,21.79,12.44,21.75,12.83L21.75,12.83z M15.43,20.45c-0.3,0.12-0.6,0.23-0.91,0.32l-0.22,0.55c0.3-0.08,0.6-0.16,0.89-0.27L15.43,20.45L15.43,20.45z M14.08,21.37l0.21-0.55c-1.34,0.35-2.77,0.4-4.21,0.09l0.34,0.55c0.81,0.14,1.62,0.17,2.41,0.1C13.26,21.53,13.67,21.46,14.08,21.37L14.08,21.37z M5.03,17.88c-0.21-0.25-0.4-0.5-0.58-0.77l-0.59-0.04c0.16,0.26,0.34,0.52,0.53,0.77L5.03,17.88L5.03,17.88z M3.73,16.88l0.58,0.03c-0.02-0.03-0.03-0.05-0.05-0.08c-0.73-1.17-1.2-2.5-1.34-3.9l-0.42,0.49c0.06,0.39,0.14,0.77,0.25,1.15c0.11,0.41,0.25,0.8,0.42,1.19C3.33,16.14,3.52,16.51,3.73,16.88L3.73,16.88L3.73,16.88z M4.26,7.18c0.17-0.28,0.36-0.54,0.55-0.79L4.66,5.81C4.46,6.05,4.27,6.3,4.09,6.56L4.26,7.18L4.26,7.18z M4.81,5.64l0.15,0.57c0.63-0.77,1.38-1.42,2.21-1.94c0.37-0.23,0.75-0.43,1.14-0.61l-0.6-0.25C7.36,3.59,7.03,3.78,6.7,4C6.36,4.23,6.02,4.48,5.71,4.75C5.39,5.02,5.1,5.32,4.81,5.64L4.81,5.64L4.81,5.64z M14.19,3.15c0.32,0.08,0.63,0.17,0.93,0.28l0.5-0.32c-0.29-0.12-0.58-0.22-0.88-0.31L14.19,3.15L14.19,3.15z M15.83,3.2l-0.49,0.32c1.36,0.53,2.53,1.36,3.46,2.4l0.05-0.65c-0.27-0.27-0.55-0.53-0.85-0.77c-0.32-0.25-0.65-0.49-1.01-0.71c-0.36-0.22-0.74-0.41-1.13-0.58L15.83,3.2L15.83,3.2z M19.49,16.86l-1.29,0.31c-0.28,0.33-0.58,0.64-0.9,0.92c-0.32,0.28-0.67,0.54-1.03,0.76l-0.48,1.24C17.28,19.39,18.57,18.28,19.49,16.86L19.49,16.86z M9.69,20.62L9,19.49c-0.41-0.16-0.8-0.36-1.16-0.58c-0.37-0.22-0.71-0.47-1.04-0.74l-1.32-0.08C6.58,19.28,8.02,20.18,9.69,20.62L9.69,20.62z M3.08,12.47l0.86-1.01c0.03-0.42,0.09-0.85,0.19-1.27c0.1-0.43,0.23-0.84,0.39-1.23L4.19,7.67C3.79,8.38,3.49,9.16,3.3,9.99C3.11,10.82,3.04,11.66,3.08,12.47L3.08,12.47z M8.8,3.66l1.22,0.51c0.41-0.1,0.83-0.18,1.26-0.21c0.43-0.04,0.86-0.04,1.3-0.01l1.12-0.71C12,2.9,10.31,3.08,8.8,3.66L8.8,3.66z M18.94,6.38L18.83,7.7c0.46,0.73,0.8,1.52,1,2.36l1.03,0.84C20.66,9.24,19.98,7.67,18.94,6.38L18.94,6.38z M18.16,16.99l1.48-0.35c0.48-0.79,0.85-1.67,1.07-2.63c0.22-0.95,0.28-1.91,0.19-2.83l-1.22-1l-0.02-0.06c-0.1-0.41-0.23-0.81-0.4-1.19c-0.16-0.39-0.36-0.76-0.58-1.12l-0.03-0.05l0.13-1.58c-1.2-1.39-2.83-2.43-4.76-2.88c-0.01,0-0.03-0.01-0.04-0.01l-1.33,0.85l-0.06,0c-0.21-0.02-0.43-0.02-0.64-0.02c-0.22,0-0.43,0.01-0.63,0.03c-0.21,0.02-0.41,0.05-0.62,0.08c-0.21,0.04-0.41,0.08-0.61,0.13l-0.06,0.02L8.55,3.76C6.81,4.5,5.31,5.78,4.32,7.44l0.4,1.53L4.7,9.03C4.62,9.22,4.55,9.41,4.49,9.62c-0.06,0.2-0.12,0.4-0.17,0.61c-0.05,0.21-0.09,0.41-0.12,0.62c-0.03,0.21-0.05,0.42-0.07,0.63l0,0.06l-1.03,1.2c0.16,1.93,0.94,3.73,2.19,5.16l1.58,0.09l0.05,0.04c0.16,0.13,0.32,0.26,0.49,0.38c0.17,0.12,0.34,0.24,0.52,0.34c0.18,0.11,0.36,0.21,0.56,0.31c0.19,0.09,0.38,0.18,0.58,0.26l0.06,0.02l0.82,1.35c0.01,0,0.03,0.01,0.04,0.01c1.93,0.44,3.85,0.23,5.54-0.5l0.58-1.47l0.05-0.03c0.18-0.11,0.35-0.23,0.52-0.35c0.17-0.13,0.33-0.26,0.49-0.39c0.16-0.14,0.31-0.28,0.46-0.43c0.15-0.15,0.29-0.31,0.42-0.47L18.09,17L18.16,16.99L18.16,16.99z"
  }, 
  "therm-mid-rotate": {
    "keywords": [],
    "path": "M20.05,11.29c-0.02-0.22-0.05-0.44-0.08-0.66l0.83,0.68c0.14,1.8-0.27,3.58-1.19,5.14l-1.05,0.25C19.65,15.19,20.22,13.3,20.05,11.29L20.05,11.29z M5.9,17.3c-1.32-1.52-1.97-3.39-1.98-5.26l-0.7,0.82c0.17,1.8,0.89,3.48,2.06,4.86l1.07,0.06C6.2,17.63,6.05,17.47,5.9,17.3L5.9,17.3z M10.18,19.87c-0.22-0.05-0.43-0.11-0.64-0.17l0.56,0.92c1.76,0.39,3.59,0.23,5.26-0.46l0.39-1C14.1,20.02,12.14,20.32,10.18,19.87L10.18,19.87z M8.84,4.56c0.2-0.09,0.41-0.16,0.62-0.23L8.47,3.91C6.81,4.64,5.43,5.84,4.48,7.37l0.27,1.04C5.58,6.74,6.99,5.35,8.84,4.56z M13.82,4.12c1.96,0.45,3.59,1.58,4.69,3.09l0.09-1.07c-1.2-1.35-2.77-2.29-4.52-2.72L13.17,4C13.38,4.03,13.6,4.07,13.82,4.12z"
  }, 
  "therm-out-mid-rotate": {
    "keywords": [],
    "path": "M2.76,12.34l-0.5,0.58c-0.1-1.04-0.03-2.1,0.21-3.12C2.7,8.78,3.1,7.79,3.66,6.88l0.19,0.74C3.07,9.06,2.7,10.7,2.76,12.34L2.76,12.34z M8.81,3.32c1.54-0.56,3.21-0.71,4.83-0.42l0.65-0.41c-1.04-0.25-2.11-0.33-3.15-0.23C10.09,2.35,9.06,2.61,8.1,3.02L8.81,3.32L8.81,3.32z M19.26,6.28c1.01,1.29,1.67,2.84,1.89,4.46l0.59,0.49c-0.08-1.07-0.34-2.1-0.75-3.07c-0.41-0.96-0.98-1.86-1.67-2.65L19.26,6.28L19.26,6.28z M19.67,17.15c-0.92,1.36-2.18,2.46-3.66,3.18l-0.28,0.71c0.99-0.41,1.9-0.97,2.69-1.66c0.79-0.69,1.47-1.5,2-2.4L19.67,17.15L19.67,17.15z M9.46,20.89c-1.58-0.45-3.02-1.32-4.15-2.5l-0.76-0.05c0.69,0.82,1.51,1.5,2.41,2.04c0.9,0.54,1.88,0.93,2.9,1.16L9.46,20.89L9.46,20.89z"
  }, 
  "therm-outer": {
    "keywords": [],
    "path": "M23.688,12.892c0.022-0.295,0.033-0.595,0.033-0.892c0-2.116-0.57-4.189-1.648-5.996l-0.415,0.247c-0.293-0.49-0.625-0.96-0.994-1.405l0.374-0.309c-1.551-1.876-3.605-3.206-5.94-3.844l-0.128,0.467c-0.551-0.15-1.116-0.258-1.69-0.323l0.055-0.483c-0.44-0.05-0.89-0.075-1.336-0.075c-1.96,0-3.899,0.493-5.608,1.426l0.232,0.424c-0.502,0.274-0.984,0.588-1.442,0.94L4.886,2.683c-1.933,1.478-3.34,3.48-4.068,5.79L1.28,8.618c-0.171,0.545-0.301,1.105-0.388,1.676l-0.48-0.073C0.324,10.806,0.278,11.404,0.278,12c0,2.432,0.738,4.764,2.134,6.745l0.395-0.279c0.329,0.465,0.695,0.908,1.098,1.326l-0.35,0.337c1.689,1.754,3.838,2.923,6.215,3.381l0.092-0.476c0.56,0.107,1.131,0.172,1.71,0.194l-0.018,0.486c0.147,0.006,0.297,0.008,0.444,0.008c0.001,0,0.002,0,0.003,0c2.273,0,4.477-0.651,6.375-1.884l-0.264-0.406c0.478-0.311,0.935-0.66,1.367-1.046l0.324,0.363c1.817-1.621,3.067-3.724,3.615-6.082l-0.472-0.11c0.129-0.556,0.216-1.124,0.259-1.701L23.688,12.892z M5.433,19.446l-0.4,0.453c-0.446-0.394-0.859-0.826-1.234-1.289l0.471-0.38C2.852,16.474,2.072,14.262,2.072,12c0-1.16,0.198-2.296,0.589-3.376L2.089,8.417c0.204-0.564,0.456-1.105,0.749-1.62l0.527,0.3c1.119-1.966,2.891-3.506,4.99-4.335L8.131,2.197c0.549-0.218,1.121-0.39,1.711-0.513L9.967,2.28C10.631,2.142,11.315,2.072,12,2.072c1.591,0,3.11,0.365,4.517,1.084l0.277-0.54c0.532,0.273,1.038,0.59,1.513,0.946l-0.363,0.485c1.814,1.358,3.12,3.308,3.677,5.491l0.59-0.151c0.146,0.57,0.245,1.158,0.293,1.761l-0.608,0.049c0.021,0.265,0.032,0.535,0.032,0.803c0,2.004-0.594,3.936-1.719,5.585l0.5,0.341c-0.336,0.493-0.714,0.956-1.126,1.384l-0.435-0.42c-1.572,1.631-3.67,2.682-5.907,2.961l0.075,0.605c-0.431,0.054-0.871,0.082-1.317,0.082c-0.156,0-0.312-0.004-0.467-0.011l0.027-0.609C9.304,21.82,7.128,20.942,5.433,19.446z"
  }, 
  "therm-inner-lines": {
    "keywords": [],
    "path": "M11.92,19.33c-0.04,0-0.09,0-0.13,0l0.02-0.75c0.04,0,0.08,0,0.12,0L11.92,19.33z M12.18,19.33l-0.02-0.75c0.04,0,0.08,0,0.12,0l0.03,0.75C12.27,19.32,12.22,19.33,12.18,19.33z M11.52,19.32c-0.04,0-0.09-0.01-0.13-0.01l0.06-0.75c0.04,0,0.08,0.01,0.12,0.01L11.52,19.32z M12.57,19.31l-0.06-0.75c0.04,0,0.08-0.01,0.12-0.01l0.07,0.75C12.66,19.3,12.61,19.3,12.57,19.31z M11.13,19.28c-0.04,0-0.09-0.01-0.13-0.02l0.1-0.74c0.04,0.01,0.08,0.01,0.12,0.01L11.13,19.28z M12.96,19.27l-0.1-0.74c0.04-0.01,0.08-0.01,0.12-0.02l0.11,0.74C13.05,19.25,13.01,19.26,12.96,19.27z M10.74,19.23c-0.04-0.01-0.09-0.01-0.13-0.02l0.14-0.74c0.04,0.01,0.08,0.01,0.12,0.02L10.74,19.23z M13.35,19.2l-0.14-0.74c0.04-0.01,0.08-0.01,0.12-0.02l0.15,0.73C13.44,19.19,13.39,19.2,13.35,19.2z M10.36,19.15c-0.04-0.01-0.09-0.02-0.13-0.03l0.18-0.73c0.04,0.01,0.08,0.02,0.11,0.03L10.36,19.15z M13.73,19.12l-0.18-0.73c0.04-0.01,0.08-0.02,0.11-0.03l0.19,0.72C13.82,19.1,13.78,19.11,13.73,19.12z M9.98,19.05c-0.04-0.01-0.08-0.02-0.13-0.04l0.22-0.72c0.04,0.01,0.08,0.02,0.11,0.03L9.98,19.05z M14.11,19.02L13.9,18.3c0.04-0.01,0.08-0.02,0.11-0.03l0.23,0.71C14.2,18.99,14.16,19.01,14.11,19.02z M9.6,18.94c-0.04-0.01-0.08-0.03-0.12-0.04l0.25-0.7c0.04,0.01,0.07,0.03,0.11,0.04L9.6,18.94z M14.49,18.89l-0.25-0.7c0.04-0.01,0.07-0.03,0.11-0.04l0.27,0.7C14.57,18.86,14.53,18.88,14.49,18.89z M9.23,18.8c-0.04-0.02-0.08-0.03-0.12-0.05l0.29-0.69c0.04,0.02,0.07,0.03,0.11,0.04L9.23,18.8z M14.86,18.75l-0.29-0.69c0.04-0.02,0.07-0.03,0.11-0.05l0.3,0.68C14.94,18.72,14.9,18.73,14.86,18.75z M8.87,18.64c-0.04-0.02-0.08-0.04-0.12-0.06l0.33-0.67c0.04,0.02,0.07,0.03,0.11,0.05L8.87,18.64z M15.22,18.59l-0.33-0.67c0.04-0.02,0.07-0.03,0.11-0.05l0.34,0.67C15.29,18.55,15.26,18.57,15.22,18.59z M8.52,18.47c-0.04-0.02-0.08-0.04-0.11-0.06l0.36-0.65c0.03,0.02,0.07,0.04,0.1,0.06L8.52,18.47z M15.57,18.41l-0.36-0.65c0.03-0.02,0.07-0.04,0.1-0.06l0.37,0.65C15.64,18.36,15.6,18.38,15.57,18.41z M8.18,18.27c-0.04-0.02-0.07-0.05-0.11-0.07l0.4-0.63c0.03,0.02,0.07,0.04,0.1,0.06L8.18,18.27z M15.9,18.21l-0.4-0.63c0.03-0.02,0.07-0.04,0.1-0.06l0.41,0.63C15.98,18.16,15.94,18.18,15.9,18.21z M7.85,18.06c-0.04-0.02-0.07-0.05-0.11-0.07l0.43-0.61c0.03,0.02,0.06,0.04,0.1,0.07L7.85,18.06z M16.23,17.99l-0.43-0.61c0.03-0.02,0.06-0.05,0.1-0.07l0.44,0.6C16.3,17.94,16.27,17.96,16.23,17.99z M7.53,17.83c-0.03-0.03-0.07-0.05-0.1-0.08l0.46-0.59c0.03,0.02,0.06,0.05,0.09,0.07L7.53,17.83z M16.55,17.75l-0.46-0.59c0.03-0.02,0.06-0.05,0.09-0.07l0.47,0.58C16.62,17.7,16.58,17.73,16.55,17.75z M7.22,17.59c-0.03-0.03-0.07-0.06-0.1-0.09l0.49-0.56c0.03,0.03,0.06,0.05,0.09,0.08L7.22,17.59z M16.85,17.5l-0.49-0.56c0.03-0.03,0.06-0.05,0.09-0.08l0.5,0.55C16.92,17.44,16.88,17.47,16.85,17.5z M6.93,17.33c-0.03-0.03-0.06-0.06-0.09-0.09l0.52-0.54c0.03,0.03,0.06,0.05,0.09,0.08L6.93,17.33z M17.14,17.23l-0.52-0.54c0.03-0.03,0.06-0.06,0.08-0.08l0.53,0.53C17.2,17.17,17.17,17.2,17.14,17.23z M6.65,17.05c-0.03-0.03-0.06-0.06-0.09-0.1l0.55-0.51c0.03,0.03,0.05,0.06,0.08,0.09L6.65,17.05z M17.41,16.95l-0.55-0.51c0.03-0.03,0.05-0.06,0.08-0.09l0.56,0.5C17.47,16.89,17.44,16.92,17.41,16.95z M6.39,16.76c-0.03-0.03-0.06-0.07-0.08-0.1l0.58-0.48c0.03,0.03,0.05,0.06,0.08,0.09L6.39,16.76z M17.67,16.66l-0.58-0.48c0.03-0.03,0.05-0.06,0.07-0.09l0.58,0.47C17.73,16.59,17.7,16.62,17.67,16.66z M6.14,16.46c-0.03-0.03-0.05-0.07-0.08-0.1l0.6-0.45c0.02,0.03,0.05,0.06,0.07,0.09L6.14,16.46z M17.91,16.35l-0.6-0.45c0.02-0.03,0.05-0.06,0.07-0.09l0.61,0.44C17.97,16.28,17.94,16.31,17.91,16.35z M5.91,16.14c-0.02-0.04-0.05-0.07-0.07-0.11l0.62-0.41c0.02,0.03,0.04,0.07,0.07,0.1L5.91,16.14z M18.14,16.03l-0.62-0.41c0.02-0.03,0.04-0.07,0.06-0.1l0.63,0.4C18.19,15.96,18.16,15.99,18.14,16.03z M5.69,15.81c-0.02-0.04-0.05-0.07-0.07-0.11l0.64-0.38c0.02,0.03,0.04,0.07,0.06,0.1L5.69,15.81z M18.35,15.7l-0.64-0.38c0.02-0.03,0.04-0.07,0.06-0.1l0.65,0.37C18.39,15.62,18.37,15.66,18.35,15.7z M5.49,15.47c-0.02-0.04-0.04-0.08-0.06-0.12l0.66-0.35c0.02,0.03,0.04,0.07,0.06,0.1L5.49,15.47z M18.54,15.35l-0.66-0.35c0.02-0.03,0.04-0.07,0.05-0.1l0.67,0.33C18.58,15.28,18.56,15.31,18.54,15.35z M5.31,15.12C5.3,15.08,5.28,15.04,5.26,15l0.68-0.31c0.02,0.04,0.03,0.07,0.05,0.11L5.31,15.12z M18.71,15l-0.68-0.31c0.02-0.04,0.03-0.07,0.05-0.11l0.69,0.3C18.75,14.92,18.73,14.96,18.71,15z M5.15,14.76c-0.02-0.04-0.03-0.08-0.05-0.12l0.7-0.27c0.01,0.04,0.03,0.07,0.04,0.11L5.15,14.76z M18.86,14.64l-0.7-0.27c0.01-0.04,0.03-0.07,0.04-0.11l0.7,0.26C18.9,14.56,18.88,14.6,18.86,14.64z M5.01,14.39C5,14.35,4.99,14.3,4.97,14.26l0.71-0.23c0.01,0.04,0.03,0.07,0.04,0.11L5.01,14.39z M19,14.27l-0.71-0.24c0.01-0.04,0.02-0.07,0.04-0.11l0.71,0.22C19.03,14.19,19.01,14.23,19,14.27z M4.89,14.01c-0.01-0.04-0.02-0.08-0.04-0.13l0.72-0.2c0.01,0.04,0.02,0.08,0.03,0.11L4.89,14.01z M19.11,13.89l-0.72-0.2c0.01-0.04,0.02-0.08,0.03-0.11l0.73,0.18C19.13,13.81,19.12,13.85,19.11,13.89z M4.79,13.63c-0.01-0.04-0.02-0.09-0.03-0.13l0.73-0.16c0.01,0.04,0.02,0.08,0.03,0.11L4.79,13.63z M19.21,13.51l-0.73-0.16c0.01-0.04,0.02-0.08,0.02-0.12l0.73,0.14C19.22,13.43,19.21,13.47,19.21,13.51z M4.71,13.25c-0.01-0.04-0.01-0.09-0.02-0.13L5.43,13c0.01,0.04,0.01,0.08,0.02,0.12L4.71,13.25z M19.28,13.12l-0.74-0.12c0.01-0.04,0.01-0.08,0.02-0.12l0.74,0.11C19.29,13.04,19.29,13.08,19.28,13.12z M4.66,12.86c-0.01-0.04-0.01-0.09-0.01-0.13l0.74-0.08c0,0.04,0.01,0.08,0.01,0.12L4.66,12.86z M19.33,12.73l-0.74-0.08c0-0.04,0.01-0.08,0.01-0.12l0.75,0.07C19.34,12.65,19.33,12.69,19.33,12.73z M4.62,12.47c0-0.04-0.01-0.09-0.01-0.13l0.75-0.04c0,0.04,0,0.08,0.01,0.12L4.62,12.47z M19.36,12.34l-0.75-0.04c0-0.04,0-0.08,0.01-0.12l0.75,0.03C19.37,12.26,19.36,12.3,19.36,12.34z M4.6,12.07c0-0.04,0-0.09,0-0.13l0-0.01l0.75,0l0,0.01c0,0.04,0,0.08,0,0.12L4.6,12.07z M19.37,11.95h-0.75v-0.01c0-0.04,0-0.07,0-0.11l0.75-0.01C19.37,11.86,19.37,11.9,19.37,11.95L19.37,11.95z M5.35,11.7l-0.75-0.03c0-0.04,0-0.09,0.01-0.13l0.75,0.04C5.36,11.62,5.35,11.66,5.35,11.7z M18.61,11.6c0-0.04,0-0.08-0.01-0.12l0.75-0.05c0,0.04,0.01,0.09,0.01,0.13L18.61,11.6z M5.38,11.34l-0.75-0.07c0-0.04,0.01-0.09,0.01-0.13l0.74,0.08C5.38,11.27,5.38,11.3,5.38,11.34z M18.59,11.24c0-0.04-0.01-0.08-0.01-0.12l0.74-0.09c0.01,0.04,0.01,0.09,0.01,0.13L18.59,11.24z M5.42,10.99l-0.74-0.11c0.01-0.04,0.01-0.09,0.02-0.13l0.74,0.12C5.43,10.91,5.42,10.95,5.42,10.99z M18.54,10.89c-0.01-0.04-0.01-0.08-0.02-0.12l0.74-0.13c0.01,0.04,0.01,0.09,0.02,0.13L18.54,10.89z M5.48,10.64L4.74,10.5c0.01-0.04,0.02-0.09,0.03-0.13l0.73,0.16C5.49,10.57,5.48,10.61,5.48,10.64z M18.48,10.55c-0.01-0.04-0.02-0.08-0.03-0.12l0.73-0.17c0.01,0.04,0.02,0.09,0.03,0.13L18.48,10.55z M5.55,10.3l-0.73-0.18c0.01-0.04,0.02-0.08,0.03-0.13l0.72,0.2C5.57,10.22,5.56,10.26,5.55,10.3z M18.39,10.2c-0.01-0.04-0.02-0.08-0.03-0.11l0.72-0.21c0.01,0.04,0.02,0.08,0.04,0.13L18.39,10.2z M5.65,9.96L4.94,9.74c0.01-0.04,0.03-0.08,0.04-0.12l0.71,0.24C5.67,9.89,5.66,9.92,5.65,9.96z M18.29,9.86c-0.01-0.04-0.02-0.07-0.04-0.11l0.71-0.25c0.01,0.04,0.03,0.08,0.04,0.12L18.29,9.86z M5.76,9.63l-0.7-0.26c0.02-0.04,0.03-0.08,0.05-0.12l0.7,0.27C5.79,9.55,5.78,9.59,5.76,9.63z M18.17,9.53c-0.01-0.04-0.03-0.07-0.04-0.11l0.69-0.28c0.02,0.04,0.03,0.08,0.05,0.12L18.17,9.53z M5.9,9.3L5.21,9c0.02-0.04,0.04-0.08,0.05-0.12l0.68,0.31C5.93,9.23,5.91,9.26,5.9,9.3z M18.03,9.2C18.02,9.17,18,9.13,17.98,9.1l0.68-0.32c0.02,0.04,0.04,0.08,0.06,0.12L18.03,9.2z M6.05,8.98L5.38,8.65C5.4,8.61,5.42,8.57,5.44,8.53L6.1,8.88C6.08,8.91,6.06,8.94,6.05,8.98z M17.88,8.89c-0.02-0.03-0.04-0.07-0.06-0.1l0.66-0.36c0.02,0.04,0.04,0.08,0.06,0.12L17.88,8.89z M6.21,8.67L5.56,8.3C5.58,8.26,5.6,8.22,5.63,8.19l0.64,0.38C6.25,8.6,6.23,8.63,6.21,8.67z M17.71,8.58c-0.02-0.03-0.04-0.07-0.06-0.1l0.64-0.39c0.02,0.04,0.05,0.07,0.07,0.11L17.71,8.58z M6.39,8.37l-0.63-0.4c0.02-0.04,0.05-0.07,0.07-0.11l0.62,0.42C6.44,8.3,6.41,8.33,6.39,8.37z M17.52,8.28c-0.02-0.03-0.04-0.07-0.07-0.1l0.62-0.43c0.02,0.04,0.05,0.07,0.07,0.11L17.52,8.28z M6.59,8.08L5.98,7.64C6.01,7.6,6.04,7.57,6.06,7.53l0.6,0.45C6.64,8.01,6.61,8.04,6.59,8.08z M17.32,7.99c-0.02-0.03-0.05-0.06-0.07-0.09l0.59-0.46c0.03,0.03,0.05,0.07,0.08,0.1L17.32,7.99z M6.81,7.79L6.22,7.33c0.03-0.03,0.05-0.07,0.08-0.1L6.88,7.7C6.85,7.73,6.83,7.76,6.81,7.79z M17.1,7.71c-0.03-0.03-0.05-0.06-0.08-0.09l0.57-0.49c0.03,0.03,0.06,0.07,0.08,0.1L17.1,7.71z M7.03,7.52l-0.56-0.5c0.03-0.03,0.06-0.06,0.09-0.1l0.55,0.51C7.09,7.47,7.06,7.49,7.03,7.52z M16.87,7.44c-0.03-0.03-0.05-0.06-0.08-0.09l0.54-0.52c0.03,0.03,0.06,0.06,0.09,0.1L16.87,7.44z M7.28,7.27L6.74,6.74c0.03-0.03,0.06-0.06,0.09-0.09l0.52,0.54C7.33,7.21,7.3,7.24,7.28,7.27z M16.62,7.19c-0.03-0.03-0.06-0.05-0.09-0.08l0.51-0.54c0.03,0.03,0.06,0.06,0.09,0.09L16.62,7.19z M7.53,7.02l-0.5-0.55c0.03-0.03,0.06-0.06,0.1-0.09l0.49,0.56C7.59,6.97,7.56,7,7.53,7.02z M16.36,6.95c-0.03-0.03-0.06-0.05-0.09-0.08l0.48-0.57c0.03,0.03,0.07,0.06,0.1,0.09L16.36,6.95z M7.8,6.79L7.33,6.21c0.03-0.03,0.07-0.05,0.1-0.08l0.46,0.59C7.86,6.74,7.83,6.77,7.8,6.79z M16.09,6.72c-0.03-0.02-0.06-0.05-0.09-0.07l0.45-0.6c0.03,0.03,0.07,0.05,0.1,0.08L16.09,6.72z M8.08,6.58l-0.44-0.6C7.67,5.95,7.71,5.92,7.75,5.9l0.43,0.61C8.14,6.53,8.11,6.55,8.08,6.58z M15.8,6.51c-0.03-0.02-0.06-0.04-0.1-0.07l0.42-0.62c0.04,0.02,0.07,0.05,0.11,0.07L15.8,6.51z M8.37,6.38L7.96,5.75C8,5.72,8.04,5.7,8.07,5.68l0.4,0.63C8.44,6.33,8.4,6.35,8.37,6.38z M15.51,6.32c-0.03-0.02-0.07-0.04-0.1-0.06l0.39-0.64c0.04,0.02,0.07,0.05,0.11,0.07L15.51,6.32z M8.67,6.19L8.3,5.54C8.34,5.52,8.37,5.5,8.41,5.48l0.36,0.65C8.74,6.15,8.71,6.17,8.67,6.19z M15.21,6.14c-0.03-0.02-0.07-0.04-0.1-0.06l0.35-0.66c0.04,0.02,0.08,0.04,0.11,0.06L15.21,6.14z M8.98,6.02L8.64,5.36C8.68,5.34,8.72,5.32,8.76,5.3l0.33,0.67C9.05,5.99,9.02,6,8.98,6.02z M14.89,5.98c-0.04-0.02-0.07-0.03-0.11-0.05l0.32-0.68c0.04,0.02,0.08,0.04,0.12,0.06L14.89,5.98z M9.3,5.87L9,5.19c0.04-0.02,0.08-0.04,0.12-0.05l0.29,0.69C9.38,5.84,9.34,5.85,9.3,5.87z M14.57,5.83c-0.04-0.02-0.07-0.03-0.11-0.04l0.28-0.69c0.04,0.02,0.08,0.03,0.12,0.05L14.57,5.83z M9.63,5.74l-0.27-0.7c0.04-0.02,0.08-0.03,0.12-0.05l0.25,0.7C9.7,5.71,9.67,5.72,9.63,5.74z M14.25,5.7c-0.04-0.01-0.07-0.03-0.11-0.04l0.24-0.71C14.42,4.97,14.46,4.98,14.5,5L14.25,5.7z M9.97,5.62L9.74,4.91c0.04-0.01,0.08-0.03,0.13-0.04l0.21,0.72C10.04,5.6,10,5.61,9.97,5.62z M13.91,5.59c-0.04-0.01-0.08-0.02-0.11-0.03L14,4.84c0.04,0.01,0.08,0.02,0.13,0.04L13.91,5.59z M10.3,5.52L10.12,4.8c0.04-0.01,0.08-0.02,0.13-0.03l0.18,0.73C10.38,5.5,10.34,5.51,10.3,5.52z M13.57,5.5c-0.04-0.01-0.08-0.02-0.11-0.03l0.16-0.73c0.04,0.01,0.09,0.02,0.13,0.03L13.57,5.5z M10.65,5.44L10.5,4.71c0.04-0.01,0.09-0.02,0.13-0.03l0.14,0.74C10.73,5.43,10.69,5.43,10.65,5.44z M13.22,5.42c-0.04-0.01-0.08-0.01-0.12-0.02l0.13-0.74c0.04,0.01,0.09,0.02,0.13,0.02L13.22,5.42z M11,5.38l-0.11-0.74c0.04-0.01,0.09-0.01,0.13-0.02l0.1,0.74C11.07,5.37,11.04,5.37,11,5.38z M12.88,5.37c-0.04-0.01-0.08-0.01-0.12-0.01l0.09-0.74c0.04,0.01,0.09,0.01,0.13,0.02L12.88,5.37z M11.35,5.34l-0.07-0.75c0.04,0,0.09-0.01,0.13-0.01l0.06,0.75C11.43,5.33,11.39,5.33,11.35,5.34z M12.52,5.33c-0.04,0-0.08-0.01-0.12-0.01l0.05-0.75c0.04,0,0.09,0.01,0.13,0.01L12.52,5.33z M11.7,5.31l-0.03-0.75c0.04,0,0.09,0,0.13,0l0.02,0.75C11.78,5.31,11.74,5.31,11.7,5.31z M12.17,5.31c-0.04,0-0.08,0-0.12,0l0.01-0.75c0.04,0,0.09,0,0.13,0L12.17,5.31z"
  }  
};


  async function getIcon(name) {
    return {path: THR_ICONS_MAP[name]?.path};
  }
  async function getIconList() {
    return Object.entries(THR_ICONS_MAP).map(([icon, content]) => ({
      name: icon,
      keywords: content.keywords,
    }));
  }
  
  window.customIcons = window.customIcons || {};
  window.customIcons["thr"] = { getIcon, getIconList };
  
  window.customIconsets = window.customIconsets || {};
  window.customIconsets["thr"] = getIcon;

  const labelElement = this.shadowRoot.querySelector('.label');
  if (labelElement) {
    labelElement.textContent = this.config.label;
  }
}

set hass(hass) {
  this._hass = hass;
  this._updateData();
}
}

customElements.define('thermo-bmb-card', ThermoBmbCard);
