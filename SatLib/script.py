import sys

def something(x,y,z):
    ret = x + str(1) + y + str(2) + z + str(3)
    return ret

print(something(sys.argv[1],sys.argv[2],sys.argv[3]))