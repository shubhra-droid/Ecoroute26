const emissionFactors = {
  car:120,
  bus:80,
  bike:0,
  walk:0,
  metro:45
};

function calculateCarbon(distance,mode){

  const factor = emissionFactors.hasOwnProperty(mode) ? emissionFactors[mode] : 100;

  const km = distance/1000;

  return km*factor;

}

module.exports = calculateCarbon;