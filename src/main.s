#.include "constants.s"
#.include "functions.s"

.global _start
.align 2

_start: 
    bl print_yeshua_loves_you
    bl print_yeshua_loves_you

    mov X0, #0
    mov X16, #1
    svc #0x80

.global print_yeshua_loves_you

print_string:
    mov x0, #1
    mov x2, #22
    mov x16, #4
    svc #0x80
    ret

print_yeshua_loves_you:
    # save value of link register to stack
    stp x30, x1, [sp, #-16]!
    adr x1, text
    bl print_string
    # restore value of link register from stack
    ldp x30, x1, [sp], #16
    ret

text: .ascii "yeshuaddd loves you!\n\0"