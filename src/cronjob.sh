#!/bin/sh
# Borrow from http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && cd .. && pwd )"
NODE=$(which node)

comment=""

get_comment(){
  i=1
  for word in $(git diff --numstat)
  do
    case $((i++%3)) in
      1)
        comment=$word"+ "$comment
        ;;
      2)
        comment=$word"-"$comment
        ;;
      0)
        comment=$word":"$comment
        ;;
      *)
        ;;
    esac
  done
}

printf "=================\n"
printf "$(date)\n"
printf "=================\n"
${NODE} ${DIR}/src/index.js
printf "=================\n"
get_comment
cd ${DIR}
git add .
git commit -a -m "$comment"
git push
printf "=================\n\n"
