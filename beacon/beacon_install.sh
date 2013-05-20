#/bin/sh!
if [ ! -f "/etc/init/f391_beacon.conf" ]; then
  cp -v beacon.conf /etc/init/f391_beacon.conf
  echo "Copied"
fi