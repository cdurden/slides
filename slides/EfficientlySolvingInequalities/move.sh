for f in `ls -1 *.html`
do
 nf=`echo ${f} | sed 's/html/md/'`
 mv $f $nf
done
