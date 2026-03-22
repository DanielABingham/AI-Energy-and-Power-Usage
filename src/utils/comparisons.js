export function getWaterComparison(ml) {
  if (ml === 0) return null;
  if (ml < 0.5) return `less than a raindrop`;
  if (ml < 15) return `about ${((ml / 15) * 100).toFixed(0)}% of a tablespoon`;
  if (ml < 30) return `roughly ${(ml / 30).toFixed(1)} tablespoons`;
  if (ml < 250)
    return `about ${((ml / 250) * 100).toFixed(0)}% of a glass of water`;
  if (ml < 500) return `about ${(ml / 500).toFixed(1)} water bottles`;
  if (ml < 2000) return `${(ml / 500).toFixed(1)} water bottles`;
  return `${(ml / 1000).toFixed(2)} liters — a large bottle of water`;
}

export function getElectricityComparison(wh) {
  if (wh === 0) return null;
  if (wh < 0.01) return `less than a camera flash`;
  if (wh < 0.1) return `an LED bulb for ${((wh / 0.1) * 6).toFixed(0)} seconds`;
  if (wh < 1) return `charging a phone for ${(wh * 60).toFixed(0)} seconds`;
  if (wh < 10) return `running a phone screen for ${wh.toFixed(1)} minutes`;
  if (wh < 100)
    return `powering a laptop for ${((wh / 60) * 60).toFixed(1)} minutes`;
  if (wh < 1000)
    return `running a microwave for ${(wh / 1000).toFixed(2)} minutes`;
  return `${(wh / 1000).toFixed(3)} kWh — a refrigerator for ${(wh / 150).toFixed(1)} hours`;
}

export function getCarbonComparison(g) {
  if (g === 0) return null;
  if (g < 0.1) return `less than a breath of air`;
  if (g < 1)
    return `driving a car ${(((g / 1000) * 1000) / 0.21).toFixed(1)} meters`;
  if (g < 10) return `about ${(g / 2.3).toFixed(1)}% of burning a match`;
  if (g < 100) return `equivalent to driving ${(g / 210).toFixed(2)} km`;
  if (g < 1000) return `like idling a car for ${(g / 2333).toFixed(1)} minutes`;
  return `${(g / 1000).toFixed(2)} kg CO₂ — a short domestic flight emits ~255kg`;
}
