export const SENSOR_THRESHOLDS = {
  suhu_air: { min: 18, max: 28 },
  suhu_udara: { min: 20, max: 30 },
  kelembapan: { min: 40, max: 80 },
  tds: { min: 500, max: 1500 },
  ph: { min: 5.5, max: 7.5 },
};

export const SENSOR_UNITS = {
  suhu_air: '°C',
  suhu_udara: '°C',
  kelembapan: '%',
  tds: 'ppm',
  ph: '',
  pompa: '',
};

export const SENSOR_LABELS = {
  suhu_air: 'Water Temperature',
  suhu_udara: 'Air Temperature',
  kelembapan: 'Humidity',
  tds: 'TDS',
  ph: 'pH Level',
  pompa: 'Pump Status',
};