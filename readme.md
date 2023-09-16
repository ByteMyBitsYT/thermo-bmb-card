# Thermo-BMB-Card for Home Assistant (Version 0.8)

Thermo-BMB-Card is a custom frontend card for Home Assistant designed to provide real-time temperature and humidity data in a visually engaging manner.

## What's New in Version 0.8

- Font size and margin scaling
- Customizable temperature and humidity icons
- Color gradient for changing colors
- Fixed more-info popup for temperature and humidity
- Fixed z-index layering

## Features

- Display temperature and humidity from separate sensor entities.
- Control up to 5 layers of spinning animations with various configurations.
- Color-changing icons based on temperature and humidity.
- Flashing alert feature for critical temperature levels.
- Highly configurable to fit various card sizes.


### Basic Configuration

```yaml
type: custom:thermo-bmb-card
temperature_sensor: sensor.temperature_sensor
humidity_sensor: sensor.humidity_sensor
label: Livingroom
```

### Advanced Configuration (New in 0.8)

```yaml
type: custom:thermo-bmb-card
temperature_sensor: sensor.temperature_sensor
humidity_sensor: sensor.humidity_sensor
label: Thermo BmB Card
critical: 50
temperaturefontsize: '-1'
temperatureicon: cil:home-climate-outline
humidityfontsize: '-2'
labelfontsize: '-1'
spinlayer1: 'yes'
spinlayer2: 'yes'
spinlayer3: 'yes'
spinlayer4: 'yes'
spinlayer5: 'yes'
flashlayer1: 'yes'
flashlayer2: 'no'
flashlayer3: 'yes'
flashlayer4: 'no'
flashlayer5: 'no'
speedlayer1: 110
speedlayer2: 50
speedlayer3: 60
speedlayer4: 300
speedlayer5: 150
directionlayer1: reverse
directionlayer2: normal
directionlayer3: reverse
directionlayer4: reverse
directionlayer5: normal
maxTemp: 95
midTemp: 65
minTemp: 40
maxColor: '#a12925'
midColor: '#17ad53'
minColor: '#4242c9'
```

#### Explanation of New Configurations (0.8)

- **Font Size**: Adjust the font size. Default is `14`.
- **Margin Scale**: Scale the margins. Default is `1`.
- **Temperature Icon**: Customize the temperature icon.
- **Humidity Icon**: Customize the humidity icon.
- **Z-Index**: Fix z-index layering.
- **More Info Fixed**: Fixed more-info popup for temperature and humidity.

## Installation

1. Download `thermo-bmb-card.js` and place it in your `www/community/thermo-bmb-card/` directory within Home Assistant.
2. Import it as a module in your Home Assistant configuration.
3. Clear your browser cache to ensure new features are loaded.

## Planned Improvements

- Customizable color options for temperature and humidity icons.
- Visual configuration editor for more intuitive setup.
- Variable spin rates based on temperature readings.
- Individual history views for temperature and humidity.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is open-source and available under the MIT License.

## Screenshots

![Screenshot 1](./thermo-bmb-screen%20(1).jpg)
![Screenshot 2](./thermo-bmb-screen%20(2).jpg)
![Screenshot 3](./thermo-bmb-screen%20(3).jpg)

## Animated Preview

![Animated Preview](./giffy-gif.gif)
