/*eslint-env node*/
/*expected
initial->s1_1->s1_2->s1_3->s1_6;
s1_1->s1_4->s1_5->s1_6;
s1_2->final;
s1_4->thrown;
*/
if (a) {
    return 0;
} else {
    throw new Error("err");
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    thrown[label="✘",shape=circle,width=0.3,height=0.3,fixedsize];
    s1_1[label="Program\nIfStatement\nIdentifier (a)"];
    s1_2[label="BlockStatement\nReturnStatement\nLiteral (0)"];
    s1_3[label="BlockStatement:exit"];
    s1_6[label="IfStatement:exit\nProgram:exit"];
    s1_4[label="BlockStatement\nThrowStatement\nNewExpression\nIdentifier (Error)\nLiteral (err)"];
    s1_5[label="BlockStatement:exit"];
    initial->s1_1->s1_2->s1_3->s1_6;
    s1_1->s1_4->s1_5->s1_6;
    s1_2->final;
    s1_4->thrown;
}
*/
