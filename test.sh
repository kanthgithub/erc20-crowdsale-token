ganache-cli -p 9545 > log &
sleep 15
cat log
ps
truffle test 