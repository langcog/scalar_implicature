rm(list=ls())
source("~/Projects/R/Ranalysis/useful_dplyr.R")
library("rjson")

files <- dir("production-results/")

d <- data.frame()

for (f in files) {
  jf <- paste("production-results/",f,sep="")
  jd <- fromJSON(paste(readLines(jf), collapse=""))
  id <- data.frame(workerid = jd$WorkerId, 
                   comparison = jd$answer$comparison,
                   scale = jd$answer$scale,
                   domain = jd$answer$domain,
                   rating = as.numeric(jd$answer$rating),
                   language = jd$answer$language)
  d <- bind_rows(d, id)
}

####