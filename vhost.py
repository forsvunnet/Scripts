import sys, os

if len(sys.argv) <> 2:
  print("WRONG");
  exit;
o = open("/etc/apache2/sites-available/" + sys.argv[1],"w")
r = open("/etc/apache2/sites-available/default")
s = r.read()
#print(os.getcwd())
s = s.replace("DIRPATH", os.getcwd())
s = s.replace("SITENAME", sys.argv[1])
o.write(s)
o.close()
r.close()

r = open("/etc/hosts", "r")
s = r.read();
host = "\n127.0.0.1 " + sys.argv[1]
if not host in s:
  o = open("/etc/hosts", "a")
  o.write(host)
  o.close()

r.close()

os.system("a2ensite "+sys.argv[1])
os.system("service apache2 reload")
