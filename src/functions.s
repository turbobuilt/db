# a simple function that prints the words "yeshua loves you!" to the console, macos arm 8.5va

.global print_yeshua_loves_you

print_string:
    mov x0, #1
    # adr x1, text
    mov x2, #13
    mov x16, #4
    svc #0x80
    ret

print_yeshua_loves_you:
    adr x1, text
    bl print_string
    ret

text: .ascii "yeshua loves you!\n\0"