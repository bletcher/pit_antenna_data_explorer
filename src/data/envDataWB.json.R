library(readr)
library(jsonlite)
library(tidyverse)

# Rdata file copied from C:\Users\bletcher\OneDrive - DOI\projects\wbBook_quarto_targets\data\outForDownload
# loads 'envDataWB'
load("./src/data/envDataWB.RData")

# create smaller dataset for the app
d <- envDataWB |>
  dplyr::select(
    riverOrdered, date, yday, year, flowByRiver
  ) |>
  filter(
    !is.na(flowByRiver)
  )

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
