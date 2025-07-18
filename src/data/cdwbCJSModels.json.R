#########################################################
# Data loader for the CDWB CJS models
# Use the sink() option to suppress all output so we only get the cat() output in the .json file
# Do this for ALL r data loader scripts
#########################################################

options(warn = -1)
sink(tempfile()) # Suppress all output so we only get the cat() output in the .json file at the end

# force use of the correct library
.libPaths("C:/Users/bletcher/AppData/Local/R/win-library/4.5")
#print(R.home())
#print(.libPaths())

library(readr)
library(jsonlite)
library(tidyverse)
library(marked)

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
    sampleNumber, ageInSamples
  ) |>
  filter(species %in% c("bkt", "bnt", "ats")) |>
  # mutate(dateDiff = lagDetectionDate - detectionDate) |>
  mutate(
    tag = ifelse(is.na(tag), "untagged", tag),
    nPerInd = ifelse(tag == "untagged", 1, nPerInd),
    dateEmigrated = ifelse(is.na(dateEmigrated), "null", dateEmigrated),
    speciesGroup = ifelse(species == "ats", "salmon", "trout")
  ) |>
  group_by(tag) |>
  arrange(detectionDate) |>
  ungroup()


fitModels = function(dIn, ddlIn) {
    #Phi.Dot = list(formula = ~1)
    Phi.Time = list(formula = ~time)
    #p.Dot = list(formula = ~1)
    p.Time = list(formula = ~time)
    cml = create.model.list(c("Phi", "p"))
    results = crm.wrapper(
        cml,
        data = dIn,
        ddl = ddlIn,
        external = FALSE,
        accumulate = FALSE,
        replace = TRUE
    )
  return(results)
}

fitTT = function(dIn, maxAgeInSamples) {
    # Assuming your data is in a dataframe called 'df' with columns 'id' and 'date'
   # minOccasion = min(dIn$sampleNumber, na.rm=TRUE)
   # dIn$occasions = dIn$sampleNumber - minOccasion + 1
    dIn = dIn |> filter(ageInSamples > 0 & ageInSamples <= maxAgeInSamples)

    ch = with(dIn, table(tag, ageInSamples))
    ch[ch > 0] = 1
    chstr = apply(ch, 1, paste, collapse = "")
    markData = data.frame(
        tag = rownames(ch), 
        ch = chstr, stringsAsFactors = FALSE
    ) |> 
    filter(tag != "untagged") |>
    dplyr::select(ch)

    markDataProc = process.data(markData)
    markDataDdl = make.design.data(markDataProc)
    
    modelOut = fitModels(markDataProc, markDataDdl)

    phiIntercept0 <- modelOut[[1]]$results$beta$Phi["(Intercept)"]
    pIntercept0 <- modelOut[[1]]$results$beta$p["(Intercept)"]
# need to do phi and p separately in case they are 
#missing estimates for different occsaions
    estimatesPhi <- modelOut[[1]]$results$beta$Phi |>
        as.data.frame()  |>
        tibble::rownames_to_column(var = "time0") |>
        dplyr::rename(est = 2) |>
        filter(time0 != "(Intercept)") |>
        mutate(
            time = stringr::str_extract(time0, "\\d+"),
            time = as.numeric(time),
            phiBetaIntercept = phiIntercept0 + est,
        ) |>
        dplyr::select(-time0) |>
        pivot_longer(cols = c(phiBetaIntercept), names_to = "variable", values_to = "estimate") |>
        mutate(estimate01 = 1/(1 + exp(-estimate)))

    estimatesP <- modelOut[[1]]$results$beta$p |>
        as.data.frame()  |>
        tibble::rownames_to_column(var = "time0") |>
        dplyr::rename(est = 2) |>
        filter(time0 != "(Intercept)") |>
        mutate(
            time = stringr::str_extract(time0, "\\d+"),
            time = as.numeric(time),
            pBetaIntercept = pIntercept0 + est,
        ) |>
        dplyr::select(-time0) |>
        pivot_longer(cols = c(pBetaIntercept), names_to = "variable", values_to = "estimate") |>
        mutate(estimate01 = 1/(1 + exp(-estimate)))

    estimates <- bind_rows(estimatesPhi, estimatesP)
    
    return(estimates)
}

#####################################################
# Loop over cohorts and fit models
# Group by section, start date for the cohort,...maybe


modelRunsTrout <- list()
modelRunsSalmon <- list()
indexTrout <- 1
indexSalmon <- 1

dTrout <- d |> filter(species != "ats")
dSalmon <- d |> filter(species == "ats")

for (cohortIn in 1997:2015) {
#for (cohortIn in 2003:2004) {
  #print(cohortIn) Can;t have this for when the data loader actually runs because it outputs to standard output
  message(paste("Fitting models for _trout_ cohort", cohortIn))

  d2Trout <- dTrout |>
    filter(cohort == cohortIn)
  
  fitD2Trout <- fitTT(d2Trout, 16) |>
    mutate(
      cohort = cohortIn,
      speciesGroup = "trout"
    )

  modelRunsTrout[[indexTrout]] <- fitD2Trout

  indexTrout <- indexTrout + 1
}

for (cohortIn in 1997:2004) {
#for (cohortIn in 2003:2004) {
  #print(cohortIn) Can;t have this for when the data loader actually runs because it outputs to standard output
  message(paste("Fitting models for _salmon_ cohort", cohortIn))

  d2Salmon <- dSalmon |>
    filter(cohort == cohortIn)
  
  fitD2Salmon <- fitTT(d2Salmon, 16) |>
    mutate(
      cohort = cohortIn,
      speciesGroup = "salmon"
    )

  modelRunsSalmon[[indexSalmon]] <- fitD2Salmon

  indexSalmon <- indexSalmon + 1
}

modelRuns <- bind_rows(modelRunsTrout, modelRunsSalmon)

modelRunsDF <- modelRuns |>
  #bind_rows() |>
  arrange(speciesGroup, variable, cohort, time) |>  # Ensure correct order
  group_by(speciesGroup, variable, cohort) |>
  mutate(estimate01CumulProd = cumprod(estimate01)) |>
  ungroup()

#get median date for each ageInSmples/cohort
medianDates <- d |>
  group_by(speciesGroup, cohort, ageInSamples) |>
  summarise(
    medianDate = format(median(detectionDate, na.rm = TRUE), "%Y-%m-%dT%H:%M:%SZ")
  ) |>
  ungroup()

modelRunsDF <- modelRunsDF |>
  left_join(medianDates, by = c("speciesGroup", "cohort", "time" = "ageInSamples"))

dOut <- toJSON(modelRunsDF,
  pretty = TRUE,
  auto_unbox = TRUE,
  na = "null",
  digits = NA,  # Preserve numeric precision
  raw_json = FALSE,  # Ensure proper JSON encoding
  force = TRUE
)

#dOut0 <- toJSON(modelRunsDF) # this is the same size as the one above
sink() # start output to standard output
cat(dOut)

