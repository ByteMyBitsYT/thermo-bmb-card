# Thermo-BMB-Card for Home Assistant

Thermo-BMB-Card is a custom frontend card for Home Assistant that brings a sleek and animated design to your temperature and humidity readings. It's more than just functional; it adds a visual flair to your home automation dashboard.

## Features

- Displays temperature and humidity from separate entities.
- Custom animated icons that spin.
- Icons change colors based on temperature and humidity levels.
- Scalable to fit most card sizes.
- Flashing alert feature when the temperature crosses a critical threshold.

## Configuration

To use Thermo-BMB-Card, you need to specify `temperature_sensor`, `humidity_sensor`, and `label` in your Home Assistant configuration. Optionally, you can specify a `critical` temperature for flashing alerts.

### Example Configuration

```yaml
type: custom:thermo-bmb-card
temperature_sensor: sensor.temperature_sensor
humidity_sensor: sensor.humidity_sensor
critical: 75
label: Livingroom
```

## Installation

1. Download `thermo-bmb-card.js` and place it in `www/community/thermo-bmb-card/` within your Home Assistant directory.
2. Import it as a resource through Home Assistant.
3. Clear your browser cache to load the new icons which are already included in the code.

## Planned Improvements

- Add options to customize colors for temperature and humidity.
- Introduce a setup dialog box.
- Make humidity readings optional.
- Add options for controlling spin animation.
- Variable spin rates based on temperature.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is open-source and available under the MIT License.

Also, YOLO all the changes you want and share if you do some good :)

