# get_payment_code.py 
# arg1: random string from user
import os
import sys
import hashlib

BIP32CALL = "/Users/NIC/Documents/Docker-Volume/test/TxPrivacywithBIP32/utils/bip32gen"

# get entropy from user input
if len(sys.argv) < 2:
	print 'wrong input, you need to give me a random string'
	sys.exit()

rand_from_user = sys.argv[1]
entropy = hashlib.sha224(rand_from_user).hexdigest()

# get the xpub from previous entropy
cmd = "echo " + entropy + "| "
cmd = cmd + BIP32CALL + " -i entropy -f - -x -o xpub,xprv -F - "
cmd = cmd + " m/0/0"

p = os.popen(cmd,"r")
u_xpub = p.readline()
u_xpub = u_xpub[0:len(u_xpub)-1]
u_xprv = p.readline()
u_xprv = u_xprv[0:len(u_xprv)-1]

# start diffle hellman key exchange 
# using the 32 bit prefix of the user entropy as secret key  
prime = 7919
g = 2
secret = entropy[0:8]
dh_pub = pow(g, int(secret, 16), prime)

print "{" + \
      "\"paymentCode\":\"" + str(u_xpub) + "||" + str(dh_pub) + "\"," + \
      "\"dhSecret\":\"" + str(secret) + "\"," + \
      "\"xprv\":\"" + str(u_xprv) + "\"" + \
      "}"
 






