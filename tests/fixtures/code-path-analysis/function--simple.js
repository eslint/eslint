/*expected
initial->s2_1->final;
*/
/*expected
initial->s1_1->final;
*/
foo(0);

function foo(a) {
    console.log(a);
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s2_1[label="FunctionDeclaration\nIdentifier (foo)\nIdentifier (a)\nBlockStatement\nExpressionStatement\nCallExpression\nMemberExpression\nIdentifier (console)\nIdentifier (log)\nIdentifier (a)"];
    initial->s2_1->final;
}
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nExpressionStatement\nCallExpression\nIdentifier (foo)\nLiteral (0)"];
    initial->s1_1->final;
}
*/
