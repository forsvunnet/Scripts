WID=`xdotool search --title "Mozilla Firefox" | head -1`
xdotool windowactivate $WID
xdotool key F5
