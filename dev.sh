rm build/*
# assemble all the source files in the src directory
for file in src/*.s; do
    as -arch arm64 -o build/$(basename $file .s).o $file
done

# link all the object files into one executable
ld -o build/main build/*.o -lSystem -syslibroot `xcrun -sdk macosx --show-sdk-path` -e _start -arch arm64 

# run the executable
./build/main