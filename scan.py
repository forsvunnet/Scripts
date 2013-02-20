import os
import urllib2
import socket

if os.name != "nt":
    import fcntl
    import struct

    def get_interface_ip(ifname):
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        return socket.inet_ntoa(fcntl.ioctl(s.fileno(), 0x8915, struct.pack('256s',
                                ifname[:15]))[20:24])


def get_lan_ip():
    ip = socket.gethostbyname(socket.gethostname())
    if ip.startswith("127.") and os.name != "nt":
        interfaces = [
            "eth0",
            "eth1",
            "eth2",
            "wlan0",
            "wlan1",
            "wifi0",
            "ath0",
            "ath1",
            "ppp0",
            ]
        for ifname in interfaces:
            try:
                ip = get_interface_ip(ifname)
                break
            except IOError:
                pass
    return ip
ip = get_lan_ip()
i = len(ip) - 1
lan = '0'
while i > 0:
    if ip[i:i + 1] == '.':
        lan = ip[0:i] + '.'
        break
    i -= 1
if lan != '0':
    i = 0
    while i <= 255:
        tip = lan + str(i)
        if (tip == ip):
            try:
                response = urllib2.urlopen('http://' + tip + ':3391', None, 0.1).read()
                print 'RFF: ' + response
            except urllib2.URLError:
                print "Could not connect to " + tip
        i += 1
else:
    print 'lan ip not found'
