import os


def search(i, j):
    result = 0
    timeout = 5
    while not result:
        params = str(i) + ' ' + str(j)
        result = os.system('phantomjs travellink.js ' + params) == 0
        if timeout <= 0:
            result = True
            print 'Timed out'
        timeout -= 1

for i in range(0, 10):
    for j in range(-1, 5):
        search(i, j)

'''// Recursion
  if (j >= 5) {
    j = -1;
    i++;
  } else {
    j++;
  }
  if (i > 10) {
    phantom.exit();
  }
  else {
    return {
      startdate:startdate,
      enddate:enddate,
      gothere:gothere,
      goback:goback,
      i:i,j:j
    };
  }'''
