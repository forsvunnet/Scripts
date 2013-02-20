class hosts:
    hostsfile = open("/etc/hosts", "r")
    s = hostsfile.read()
    hostsfile.close()
    lines = s.split('\n')
    i = 0
    while i < len(lines):
        lines[i] = ' '.join(lines[i].split())
        i += 1

    def get(self, i):
        for line in self.lines:
            sl = line[len(line) - len(i) - 1:len(line)]
            if line[0:1] != '#' and sl == ' ' + i:
                return line.split(' ')[0]
        return 0

    def remove(self, i):
        for ndx, line in enumerate(self.lines):
            sl = line[len(line) - len(i) - 1:len(line)]
            if line[0:1] != '#' and sl == ' ' + i:
                del self.lines[ndx]
                return 1
        return 0

    def set(self, *arg):
        if len(arg) > 2:
            print 'hosts.set takes at most two arguments'
            exit()
        elif len(arg) == 1:
            host = '127.0.0.1'
            i = arg[0]
        else:
            i = arg[0]
            host = arg[1]
        for ndx, line in enumerate(self.lines):
            sl = line[len(line) - len(i) - 1:len(line)]
            if line[0:1] != '#' and sl == ' ' + i:
                #return line.split(' ')[0]
                self.lines[ndx] = host + ' ' + i
                return 1
        self.lines.append(host + ' ' + i)
        return 1

    def save(self):
        hostsfile = open("/etc/hosts", "w")
        hostsfile.write('\n'.join(self.lines))
        hostsfile.close()
