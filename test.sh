ganache-cli -e 10000000 > log &
sleep 15
cat log
ps
truffle test 