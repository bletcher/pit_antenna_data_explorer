######################################
## This file reads in cdWB_all.RData
## and writes it to a parquet file
######################################

library(readr)
library(jsonlite)
library(arrow)
library(dbplyr, warn.conflicts = FALSE)
library(duckdb)
library(tidyverse)

# loads 'all'
load("./src/data/cdWB_all.RData")

# create smaller dataset for the app
d <- all |>
  dplyr::select(
    species, tag, detectionDate, lagDetectionDate, year, riverOrdered,
    observedLength, observedWeight, survey, cohort, sectionN, riverMeter, aliveOrDead, nPerInd, readerId
  ) |>
  filter(species %in% c("bkt", "bnt", "ats")) |>
  # mutate(dateDiff = lagDetectionDate - detectionDate) |>
  mutate(
    tag = ifelse(is.na(tag), "untagged", tag),
    nPerInd = ifelse(tag == "untagged", 1, nPerInd)
  ) |>
  group_by(tag) |>
    arrange(detectionDate) |>
  ungroup()

PQPath <- "./docs/data/parquet"

d |>
  write_dataset(path = PQPath, format = "parquet")

tibble(
  files = list.files(PQPath, recursive = TRUE),
  size_MB = file.size(file.path(PQPath, files)) / 1024^2
)

#dPQ <- open_dataset(PQPath, format = "parquet")

#dDuckDB <- dPQ |> to_duckdb()