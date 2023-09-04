cd src
as -arch arm64 -o ../build/main.o main.s
cd ../build
ld -o main main.o -lSystem -syslibroot `xcrun -sdk macosx --show-sdk-path` -e _start -arch arm64 
cd ..
build/main