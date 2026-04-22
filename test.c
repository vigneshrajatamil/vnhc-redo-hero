#include <stdio.h>
#include <string.h>

char stack[50], input[50];
int top = -1;

void shift(char symbol) {
    stack[++top] = symbol;
    stack[top + 1] = '\0';
}

void reduce() {
    // For grammar: S -> aSb
    if (top >= 2) {
        if (stack[top] == 'b' && stack[top - 1] == 'S' && stack[top - 2] == 'a') {
            top -= 2;
            stack[top] = 'S';
            stack[top + 1] = '\0';
            printf("%s\t%s\tReduce S->aSb\n", stack, input);
        }
    }
}

int main() {
    int i = 0;
    printf("Enter input string: ");
    scanf("%s", input);

    strcat(input, "$");
    stack[0] = '$';
    stack[1] = '\0';

    printf("\nStack\tInput\tAction\n");
    printf("-----------------------------------\n");

    while (input[i] != '\0') {
        shift(input[i]);
        printf("%s\t%s\tShift %c\n", stack, &input[i + 1], input[i]);

        reduce();
        i++;
    }

    if (strcmp(stack, "$S") == 0)
        printf("%s\t%s\tAccept\n", stack, input);
    else
        printf("Rejected\n");

    return 0;
}