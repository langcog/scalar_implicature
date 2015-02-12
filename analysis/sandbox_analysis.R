rm(list=ls())
source("~/Projects/R/Ranalysis/useful_dplyr.R")
library("rjson")

files = dir("production-results/")

d <- data.frame()

for (f in files) {
  jf <- paste("~/Projects/Scalar Implicature/scalar_implicature/production-results/",f,sep="")
  jd <- fromJSON(paste(readLines(jf), collapse=""))
  id <- data.frame(workerid = jd$WorkerId, 
                   comparison = jd$answer$comparison,
                   scale = jd$answer$scale,
                   domain = jd$answer$domain,
                   rating = as.numeric(jd$answer$rating),
                   language = jd$answer$language)
  d <- bind_rows(d, id)
}

ms <- d %>% 
  filter(scale != "training1", scale != "training2") %>%
  group_by(comparison, scale) %>%
  summarise(cih = ci.high(rating), 
            cil = ci.low(rating), 
            rating = mean(rating))

qplot(scale, rating, fill = comparison, 
      position="dodge", stat = "identity",
      geom="bar",
      data=ms) + 
  geom_linerange(aes(ymin = rating - cil, 
                     ymax = rating + cih), 
                 position = position_dodge(width=.9)) + 
  ylim(c(0,7)) + 
  ylab("Mean Similarity")



ms <- d %>% 
  filter(scale != "training1", scale != "training2") %>%
  group_by(comparison, scale, domain) %>%
  summarise(cih = ci.high(rating), 
            cil = ci.low(rating), 
            rating = mean(rating))

qplot(comparison, rating, fill = comparison, 
      position="dodge", stat = "identity",
      geom="bar", 
      facets=scale ~ domain, 
      data=ms) + 
  geom_linerange(aes(ymin = rating - cil, 
                     ymax = rating + cih), 
                 position = position_dodge(width=.9)) + 
  ylim(c(0,7)) + 
  ylab("Mean Similarity")
