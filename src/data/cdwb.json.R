library(readr)
library(jsonlite)
library(tidyverse)

# loads 'all'
load("./src/data/cdWB_all.RData")

# create smaller dataset for the app
d <- all |>
  dplyr::select(
    species, tag, detectionDate,
    #lagDetectionDate,
    year, riverOrdered,
    observedLength, observedWeight, survey, cohort, sectionN, riverMeter,
    #aliveOrDead,
    nPerInd,
    #readerId,
    relCF, dateEmigrated,
    sampleNumber
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

dOut <- toJSON(d,
  pretty = TRUE,
  auto_unbox = TRUE,
  na = "null",
  digits = NA,  # Preserve numeric precision
  raw_json = FALSE,  # Ensure proper JSON encoding
  force = TRUE
)

#dOut0 <- toJSON(d) # this is the same size as the one above
cat(dOut)
