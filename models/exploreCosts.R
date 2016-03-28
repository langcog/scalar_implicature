library(rrrsa)
library(ggplot2)
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

## Saliency costs
salience5 <- read.csv("/Users/benpeloquin/Desktop/Projects/scalar_implicature/models/saliences5.csv")
salience5$word <- with(salience5, mapply(lookupScalar, degree, scale, exp = rep("e12", length(scale))))
  mutate(word = lookupScalar(scale = scale, degree = degree))
d5$salienceCosts <- sapply(d5$words, FUN = function(w) {
  subset(salience5, word == w)$cost
})
  
subset(salience5, word == "excellent")$cost

## Runs
checkWords <- c("good", "excellent", "liked", "loved", "memorable", "unforgettable",
                "palatable", "delicious", "some", "all")
## run with salience costs
rsa5 <- plyr::ddply(d5, "scale", rsa.runDf,
          quantityVarName = "stars",
          semanticsVarName = "speaker.p",
          itemVarName = "words",
          costsVarName = "salienceCosts",
          alpha = 4.5)
ggplot(subset(rsa5, words %in% checkWords), aes(x = stars, y = e11, col = words)) +
  geom_point() +
  facet_wrap(~scale) +
  geom_line(aes(x = stars, y = preds))