library(rrrsa)
library(dplyr)
library(tidyr)
library(stringr)

## Data
d2 <- peloquinFrank_2Alts
d3 <- peloquinFrank_3Alts
d4 <- peloquinFrank_4Alts
d5 <- peloquinFrank_5Alts

## Costs
d5$costLen <- sapply(d5$words, str_length)
d5$costLogLen <- log(d5$costLen)

## Runs
rsa5 <- plyr::ddply(d5, "scale", rsa.runDf,
                    quantityVarName = "stars", semanticsVarName = "speaker.p",
                    itemVarName = "words", costsVarName = "costLen")

checkWords <- c("good", "excellent", "liked", "loved", "memorable", "unforgettable",
                "palatable", "delicious", "some", "all")
rsa5 <- rsa.tuneDepthAlpha(d5, quantityVarName = "stars", semanticsVarName = "speaker.p",
                    groupName = "scale", itemVarName = "words", costsVarName = "costLogLen",
                    compareDataName = "e6", compareItems = checkWords, alphas = seq(1, 5, by = 0.1))


scales <- unique(d5$scale)
newData <- data.frame()
names(newData) <- names(d5)
for (s in scales) {
  currData <- d5 %>%
    filter(scale == s)
  currRun <- rsa.runDf(currData,
                       quantityVarName = "stars",
                       semanticsVarName = "speaker.p",
                       itemVarName = "words")
  
}
       
