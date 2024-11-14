const cdwbAntennaSpeciesYearsRiverRiverMeters = cdwbAntennaSpeciesYearsRiver.filter(
  d => selectedRiverMeters.includes(`${d.riverMeter}_${d.riverOrdered}`)        
) 