---
theme: dashboard
title: Raw data by individual
toc: false
style: gridCustom.css
---

```js
//const cdwb = FileAttachment("data/all_for_obs.csv").csv({typed: true});
const cdwb = FileAttachment("data/cdwb.json").json();
```

```js
import {tagsOverTime, tagsOverTimeRiver} from "./components/raw_data_by_ind.js";
```

```js
cdwb.forEach(d => {
  const detectionDate = new Date(d.detectionDate); 
  const dateEmigrated = new Date(d.dateEmigrated); 
  d.detectionDate = detectionDate;
  d.dateEmigrated = dateEmigrated;
  d.title = d.tag
});
```

```js
const cohorts = [...new Set(cdwb.map(d => d.cohort))].sort();
const selectCohorts = (Inputs.select(cohorts, {value: 2005, multiple: 8, label: "Select cohorts:"}));
const selectedCohorts = Generators.input(selectCohorts);

const species = [...new Set(cdwb.map(d => d.species))].sort();
const selectSpecies = (Inputs.select(species, {value: species, multiple: true, label: "Select species:"}));
const selectedSpecies = Generators.input(selectSpecies);
```

```js
/*
const tagCounts = cdwb.reduce((acc, d) => {
  acc[d.tag] = (acc[d.tag] || 0) + 1;
  return acc;
}, {});
const filteredTagsByCount = Object.keys(tagCounts).filter(tag => tagCounts[tag] > 2); */
```

```js
const cdwbFiltered = cdwb.filter(d => 
  selectedSpecies.includes(d.species) && 
  selectedCohorts.includes(d.cohort) 
);
```

```js
 //searchTags 

//cdwbFilteredTag
//tagCounts
//tags//ToPlot
```

```js
const tagCountsFiltered = cdwbFiltered.reduce((acc, d) => {
  acc[d.tag] = (acc[d.tag] || 0) + 1;
  return acc;
}, {});
const sortedTags = Object.entries(tagCountsFiltered)
  .sort((a, b) => b[1] - a[1])
  .map(entry => entry[0]); 

//const searchTags = Inputs.search(sortedTags, {placeholder: "Type to filter tags"});
//const searchedTags = Generators.input(searchTags);

const selectTags = (Inputs.select(sortedTags, {
  //value: searchedTags, 
  multiple: 8, label: "Select tags:"}));
const selectedTags = Generators.input(selectTags);
```

```js
const cdwbFilteredTag = cdwb.filter(d => 
  selectedTags.includes(d.tag)
);
```

selectTags length: ${cdwbFilteredTag.length}  

<div class="wrapper2">
  <div class="card selectors">
    <div style="margin-top: 10px; margin-bottom: 0px">
      ${selectCohorts}
    </div>
    <div style="margin-top: 10px; margin-bottom: 0px">
      ${selectSpecies}
    </div>
    <hr>
    <div style="margin-top: 10px; margin-bottom: 0px">
      ${selectTags}
    </div>
  </div>
  <hr>
  <div class="card indGraph1">
    <div style="margin-top: 10px; margin-bottom: 0px">
    ${resize((width) => tagsOverTime(
      cdwbFilteredTag,
      {width})
    )}
    </div>
  </div>
  <div class="card indGraph2">
    <div style="margin-top: 10px; margin-bottom: 0px">
    ${resize((width) => tagsOverTimeRiver(
      cdwbFilteredTag,
      {width})
    )}
    </div>
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