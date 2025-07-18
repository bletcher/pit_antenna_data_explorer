import { tidy, leftJoin, groupBy, summarize, n, sort, arrange, desc, sum, min, max, first, mutate, filter } from '@tidyjs/tidy'


export function getDatByIndividual(dIn) {

  const datByIndividual = tidy(
    dIn,
    filter((d) => d.title !== "untagged"),
    groupBy("title", [
        summarize({
             count: n(),
             minDate: min('detectionDate'),
             maxDate: max("detectionDate"),
             maxYear: max(d => new Date(d.detectionDate).getFullYear()),
             dates: (d) => d.map(x => x.detectionDate),
             datesLengths: (d) => d.map(x => ({date: x.detectionDate, observedLength: x.observedLength})),
             datesWeights: (d) => d.map(x => ({date: x.detectionDate, observedWeight: x.observedWeight})),
             years: (d) => d.map(x => x.detectionDate.getFullYear()),
             sampleNumbers: (d) => d.map(x => x.sampleNumber),
             cohort: first('cohort'),
             species: first('species'),
             survey: first('survey'),
      // Acquisition_Lead: firstTransaction["Acquisition Lead"],
      // recurring: firstTransaction["Recurring Donation? [Actblue]"] || "null", // Ensure null values are handled
        })
    ]),
    arrange([desc('count')]),
    mutate({
      countGT1: (d) => d.count > 1,
    })
  )
  return datByIndividual;
}
