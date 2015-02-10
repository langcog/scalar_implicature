library("rjson")

files = dir("sandbox results/")

d <- data.frame()

for (f in files) {
  jf <- "~/Projects/Scalar Implicature/scalar_implicature/sandbox results/37WLF8U1WPQDXL36ZJVINNNQG38K6F.json"
  jd <- fromJSON(paste(readLines(json_file), collapse=""))
  
  d <- bind_rows(d, 
                 data.frame(workerid = jd$WorkerId, 
                            comparison = jd$answer$comparison,
                            scale = jd$answer$scale,
                            rating = jd$answer$rating,
                            language = jd$answer$language))
}
                            
