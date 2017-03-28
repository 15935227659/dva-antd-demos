#!/bin/bash

PASSWORD=$1
SRC=$2
DST=$3
EXCLUDE=$4

expect -c "
    set password ${PASSWORD}
    spawn /usr/bin/rsync -av ${SRC} --exclude='logs' --exclude='.git' --exclude='.gitignore' --exclude='storage/*' --exclude='*/*.swp' ${DST}
    set timeout 1200
    expect {
    \"*password*\" {send \"${PASSWORD}\r\";}
    }
expect eof;"
