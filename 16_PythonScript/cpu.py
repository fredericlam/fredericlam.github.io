## Test bourrin CPU
import time as t

def test(n):
	t0 = t.time()
	for k in range(n):
		x=k**2
	t1 = t.time()
	print(t1-t0)

test(100000000)