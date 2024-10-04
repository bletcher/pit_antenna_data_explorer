library(readr)
library(jsonlite)
library(tidyverse)

# loads 'all'
load("./docs/data/cdWB_all.RData")

# create smaller dataset for the app
d <- all |>
  dplyr::select(
    species, tag, detectionDate,
    #lagDetectionDate, 
    year, riverOrdered,
    observedLength, observedWeight, survey, cohort, sectionN, riverMeter, 
    #aliveOrDead, 
    nPerInd, readerId, 
    relCF, dateEmigrated
  ) |>
  filter(species %in% c("bkt", "bnt", "ats")) |>
  # mutate(dateDiff = lagDetectionDate - detectionDate) |>
  mutate(
    tag = ifelse(is.na(tag), "untagged", tag),
    nPerInd = ifelse(tag == "untagged", 1, nPerInd),
    dateEmigrated = ifelse(is.na(dateEmigrated), "null", dateEmigrated)
  ) |>
  group_by(tag) |>
  arrange(detectionDate) |>
  ungroup()

# write_json(d, "./docs/data/all_for_obs.json") # this is 98 mB vs 60 for csv 
#write.csv(d, "./docs/data/all_for_obs.csv")

cat(toJSON(d))