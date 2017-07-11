library(jsonlite,quietly=TRUE)
library(parallel)

getDistance <- function(x,gene.vec) {

    ## samp.vec <- readRDS(sprintf('/Users/Jake/Documents/Projects/Mercator/src/express_prototype/data/sampDB/%s',x)) 

    eu.dist <- sum((x - gene.vec)^2)

    return(eu.dist)

}

f <- file("stdin")

open(f)

num <- readLines(f,n=1)

close(f)

## num <- '5965'

datFile <- sprintf('tmp/incoming_tsv/entry_%s.tsv',num)

## line <- readChar(datFile,file.info(datFile)$size)

## gene.vec <- fromJSON(line)

gene.dat <- read.table(datFile,header=F,sep='\t',row.names=1)

gene.vec <- gene.dat$V2
names(gene.vec) <- rownames(gene.dat)

## ordered.genes <- names(gene.vec)[order(names(gene.vec))]

## gene.vec <- as.matrix(gene.vec[ordered.genes])

## saveRDS(gene.vec,sprintf('tmp/incoming_RDS/entry_%s.RDS',num))

## samp.ids <- list.files('/Users/Jake/Documents/Projects/Mercator/src/express_prototype/data/sampDB/')

map.dat <- readRDS('/Users/Jake/Documents/Projects/Mercator/data/recount/pca/recount_pca.RDS')

rotation.dat <- readRDS('/Users/Jake/Documents/Projects/Mercator/data/recount/pca/recount_rotation_50.RDS')

map.centers <- readRDS('/Users/Jake/Documents/Projects/Mercator/data/recount/pca/pca_center.RDS')

center.vec <- gene.vec - map.centers

rot.vec <- t(center.vec) %*% rotation.dat

no_cores <- detectCores() - 1
cl <- makeCluster(no_cores)

## getDistance(samp.ids[1])

dist.vec <- parApply(cl,map.dat,1,getDistance,gene.vec=rot.vec)

names(dist.vec) <- gsub(".RDS","",names(dist.vec))

## write.table(dist.vec,stdout(),sep='\t')

write.table(dist.vec,sprintf('/Users/Jake/Documents/Projects/Mercator/src/express_prototype/tmp/outgoing/entry_%s.tsv',num),sep='\t')

stopCluster(cl)
