---
theme: dashboard
title: Raw data by individual
toc: true
---

# Raw data exploration by individual fish  

```js
//const cdwb = FileAttachment("data/all_for_obs.csv").csv({typed: true});
const cdwb = FileAttachment("data/cdwb.json").json();
```

```js
import {tagsOverTime} from "./components/raw_data_by_ind.js";
import {tagsOverTimeRiver} from "./components/raw_data_by_ind.js";
//import * as TMP from "./components/raw_data_by_ind.js";
```

## Subset the dataset

```js
const cohorts = [...new Set(cdwb.map(d => d.cohort))].sort();
```

```js
const selectCohort = view(Inputs.select(cohorts, {value: cohorts, multiple: true, label: "Select cohorts"}));
```

```js
const species = [...new Set(cdwb.map(d => d.species))].sort();
```

```js
const selectSpecies = view(Inputs.select(species, {value: species, multiple: true, label: "Select species"}));
```

## Select tags from subset

```js
const tags = tidy(
  cdwb,
  filter((d) => selectSpecies.includes(d.species)),
  filter((d) => selectCohort.includes(d.cohort)),
  groupBy("tag", [summarize({ n: n() })]),
  arrange([desc("n")]),
  filter((d) => d.tag != "NA"),
  filter((d) => d.n > 2)
);
```

```js
const selectTag = view(
  Inputs.select(
    tags.map((d) => d.tag), 
      {
        multiple: true, 
        label: "Select tags"
        //format: (d => `${d[,0]} n=${d[,1]}`)
      }
    )
  );
```

```js
display(selectTag)
```

```js
const tagsToPlot = tidy(
  cdwb,
  mutate({
    newDate: (d) => new Date(d.detectionDate)
  })
);
```
selectTag length: ${tagsToPlot.filter((d) => selectTag.includes(d.tag)).length}  

<div class="grid grid-cols-2">
  <div class="card">
    ${resize((width) => tagsOverTime(
      tagsToPlot.filter((d) => selectTag.includes(d.tag)), 
      {width})
      )}
  </div>
    <div class="card">
    ${resize((width) => tagsOverTimeRiver(
      tagsToPlot.filter((d) => selectTag.includes(d.tag)), 
      {width})
    )}
  </div>
</div>




```js
/* did this to get tidyjs to load

//Turns off ssl
npm set strict-ssl false
//Installs node packages
npm ci
//Turns ssl back on for future protection
npm set strict-ssl true
*/

import {
tidy,
addItems,
addRows,
arrange,
asc,
complete,
contains,
count,
cumsum,
debug,
desc,
deviation,
distinct,
endsWith,
everything,
expand,
fill,
filter,
first,
fullJoin,
fullSeq,
fullSeqDate,
fullSeqDateISOString,
groupBy,
innerJoin,
lag,
last,
lead,
leftJoin,
map,
matches,
max,
mean,
meanRate,
median,
min,
mutate,
mutateWithSummary,
n,
nDistinct,
negate,
numRange,
pick,
pivotLonger,
pivotWider,
rate,
rename,
replaceNully,
roll,
select,
slice,
sliceHead,
sliceMax,
sliceMin,
sliceSample,
sliceTail,
sort,
startsWith,
sum,
summarize,
summarizeAll,
summarizeAt,
tally,
TMath,
total,
totalAll,
totalAt,
totalIf,
transmute,
variance,
vectorSeq,
vectorSeqDate,
when
} from "@tidyjs/tidy"

```