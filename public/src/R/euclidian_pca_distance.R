library(jsonlite,quietly=TRUE)
library(parallel)

getDistance <- function(x,gene.vec) {

    eu.dist <- sum((x - gene.vec)^2)

    ## eu.dist <- (x %*% gene.vec) / (norm(x,'2') * norm(gene.vec,'2'))

    return(eu.dist)

}

f <- file("stdin")

open(f)

num <- readLines(f,n=1)

close(f)

## num <- '0000'

## num <- '3844'

datFile <- sprintf('private/tmp/incoming/entry_%s.tsv',num)

gene.dat <- read.table(datFile,header=F,sep='\t',row.names=1)

gene.vec <- gene.dat$V2
names(gene.vec) <- rownames(gene.dat)

## map.dat <- readRDS('private/data/recount/pca/recount_pca.RDS')
## map.dat <- readRDS('private/data/recount/pca/recount_250_dim_noScaled_noProj_over50_noSingle_entrez.RDS')
map.dat <- readRDS('private/data/recount/pca/recount_750_dim_noProj_over50_bulkOnly.RDS')

## rotation.dat <- readRDS('private/data/recount/pca/recount_rotation_50.RDS')
## rotation.dat <- readRDS('private/data/recount/pca/recount_all_big_irlba_250_over50_noSingle_entrez_rotation.RDS')
rotation.dat <- readRDS('private/data/recount/pca/recount_all_big_irlba_750_over50_bulkonly_rotmat.RDS')

## map.centers <- readRDS('private/data/recount/pca/pca_center.RDS')
## map.centers <- readRDS('private/data/recount/pca/recount_over50_noSingle_entrez_centers.RDS')
map.centers <- readRDS('private/data/recount/pca/recount_over50_bulkOnly_colparams.RDS')

map.centers <- subset(map.centers,vars>0)
## names(gene.vec) <- gsub('[.].*$','',names(gene.vec))
gene.vec <- gene.vec[rownames(map.centers)]

center.vec <- gene.vec - map.centers$means
center.vec <- center.vec / map.centers$vars

rot.vec <- t(center.vec) %*% rotation.dat

no_cores <- detectCores() - 1
cl <- makeCluster(no_cores)

dist.vec <- parApply(cl,map.dat,1,getDistance,gene.vec=rot.vec)

dist.vec <- data.frame(y=names(dist.vec),x=dist.vec)

## dist.vec[dist.vec$x==min(dist.vec$x),'x'] <- min(subset(dist.vec,x>1)$x)
## dist.vec$x <- log(dist.vec$x+1)
## dist.vec$x <- 1.01 ^ (max(dist.vec$x) - dist.vec$x)

dist.vec$y <- gsub(".RDS","",dist.vec$y)
dist.vec$y <- gsub('^X([0-9]+)','\\1',dist.vec$y)
dist.vec$y <- gsub('\\.','-',dist.vec$y)

write.table(dist.vec,sprintf('private/tmp/outgoing/entry_%s.tsv',num),sep=',',col.names=F,row.names=F)

stopCluster(cl)
