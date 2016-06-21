# get_privkey.py
# arg1: xprv
# arg2: secret of DH key
# arg3: dh_pub of sender 

import os 
import sys

BIP32CALL = "/Users/NIC/Documents/Docker-Volume/test/TxPrivacywithBIP32/bip32utils/bip32gen"

if len(sys.argv) < 4:
	print 'wrong input, you need to give me payment code and secret key'
	sys.exit()

xprv = sys.argv[1]
secret = sys.argv[2]
dh_pub = sys.argv[3]

# index is the diffle hellman result (share secret)
prime = 7919 
index = pow(int(dh_pub), int(secret, 16), prime)

# get the xpub from previous entropy
cmd = "echo " + xprv + "| "
cmd = cmd + BIP32CALL + " -i xprv -f - -x -o addr,wif -F - "
cmd = cmd + " 0/" + str(index)

p = os.popen(cmd,"r")
addr = p.readline()
addr = addr[0:len(addr)-1]
privkey = p.readline()
privkey = privkey[0:len(privkey)-1]
print "{\"addr\":\"" + str(addr) + "\"," + "\"privkey\":" + str(privkey) + "\"}"
