# Thermo-BMB-Card for Home Assistant

Thermo-BMB-Card is a custom frontend card for Home Assistant, designed to provide not only real-time temperature and humidity data but also a visually engaging user experience. Elevate your home automation dashboard with stunning animations and intuitive alert features.

## Features

- Display temperature and humidity from separate sensor entities.
- Newly added: Control up to 5 layers of spinning animations with various configurations.
- Icons can change colors based on temperature and humidity readings.
- Flashing alert feature triggers when the temperature crosses a pre-defined critical threshold.
- Highly configurable and scalable to fit a wide range of card sizes.
- Humidity sensor and label configurations are now optional—excluding them will hide these fields.

## Configuration

### Basic Configuration

Here is a minimal example configuration:

```yaml
type: custom:thermo-bmb-card
temperature_sensor: sensor.temperature_sensor
humidity_sensor: sensor.humidity_sensor
label: Livingroom
```

### Advanced Configuration

Here's how to make use of the new features introduced in version 0.7:
(not configuring them will use default values)

```yaml
type: custom:thermo-bmb-card
temperature_sensor: sensor.temperature_sensor
humidity_sensor: sensor.humidity_sensor
label: Thermo BmB Card
critical: 80
spinlayer1: 'yes'
spinlayer2: 'yes'
spinlayer3: 'yes'
spinlayer4: 'yes'
spinlayer5: 'no'
flashlayer1: 'yes'
flashlayer2: 'no'
flashlayer3: 'yes'
flashlayer4: 'no'
flashlayer5: 'no'
speedlayer1: 110
speedlayer2: 50
speedlayer3: 60
speedlayer4: 300
speedlayer5: 40
directionlayer1: reverse
directionlayer2: normal
directionlayer3: reverse
directionlayer4: normal
directionlayer5: reverse
```

#### Explanation of New Configurations:

- **Spin**: Choose 'yes' or 'no' to enable or disable spinning for each layer. Useful for aesthetics or system performance.
- **Flash**: Set to 'yes' or 'no'. When the main sensor value exceeds the critical value, the icon layer will flash to attract attention.
- **Speed**: Sets the speed of spinning animations. Lower values yield faster speeds. Recommended range: 10-400.
- **Direction**: 'Normal' for clockwise, 'Reverse' for counter-clockwise spinning.

## Installation

1. Download `thermo-bmb-card.js` and place it in `www/community/thermo-bmb-card/` within your Home Assistant directory.
2. Import it as a module in your Home Assistant configuration.
3. Clear your browser cache to ensure new features are loaded.

## Planned Improvements

- Customizable color options for temperature and humidity icons.
- Add a visual configuration editor for more intuitive setup.
  (I tried to do this, but I am still learning. I welcome help.)
- Introduce variable spin rates based on temperature readings.
- Enable individual history views for temperature and humidity.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is open-source and available under the MIT License.

Have fun customizing your card, and don't hesitate to share your improvements!

## Screenshots

![Screenshot 1](./thermo-bmb-screen%20(1).jpg)
![Screenshot 2](./thermo-bmb-screen%20(2).jpg)
![Screenshot 3](./thermo-bmb-screen%20(3).jpg)

## Animated Preview

![Animated Preview](./giffy-gif.gif)
