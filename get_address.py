# get_address.py
# arg1: payment code 
# arg2: secret of DH key
# payment code format: xpub || dh_pub

import os 
import sys

BIP32CALL = "/Users/NIC/Documents/Docker-Volume/test/TxPrivacywithBIP32/bip32utils/bip32gen"

if len(sys.argv) < 3:
	print 'wrong input, you need to give me payment code and secret key'
	sys.exit()

payment_code = sys.argv[1]
secret = sys.argv[2]
xpub, dh_pub = payment_code.split("||")

# index is the diffle hellman result (share secret)
prime = 7919 
index = pow(int(dh_pub), int(secret, 16), prime)

# get the xpub from previous entropy
cmd = "echo " + xpub + "| "
cmd = cmd + BIP32CALL + " -i xpub -f - -x -o addr -F - "
cmd = cmd + " 0/" + str(index)

p = os.popen(cmd,"r")
addr = p.readline()
addr = addr[0:len(addr)-1]
print "{\"addr\":\"" + str(addr) + "\"}" 


