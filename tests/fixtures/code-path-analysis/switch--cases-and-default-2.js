/*expected
initial->s1_1->s1_2->s1_3->s1_7->s1_8->s1_10->s1_12->s1_13;
s1_1->s1_4->s1_6->s1_7;
s1_2->s1_13;
s1_7->s1_13;
s1_4->s1_7;
s1_6->s1_9->s1_11->s1_12;
s1_11->s1_10;
s1_13->final;
*/

switch (a) {
    case 0:
        foo();
        break;

    case 1:
    case 2:
        bar();
        break;

    default:
        hoge();
    case 3:
        fuga();
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nSwitchStatement\nIdentifier (a)\nSwitchCase\nLiteral (0)"];
    s1_2[label="ExpressionStatement\nCallExpression\nIdentifier (foo)\nBreakStatement"];
    s1_3[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s1_7[label="ExpressionStatement\nCallExpression\nIdentifier (bar)\nBreakStatement"];
    s1_8[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s1_10[label="ExpressionStatement\nCallExpression\nIdentifier (hoge)"];
    s1_12[label="ExpressionStatement\nCallExpression\nIdentifier (fuga)"];
    s1_13[label="SwitchStatement:exit\nProgram:exit"];
    s1_4[label="SwitchCase\nLiteral (1)"];
    s1_6[label="SwitchCase\nLiteral (2)"];
    s1_9[label="SwitchCase"];
    s1_11[label="SwitchCase\nLiteral (3)"];
    initial->s1_1->s1_2->s1_3->s1_7->s1_8->s1_10->s1_12->s1_13;
    s1_1->s1_4->s1_6->s1_7;
    s1_2->s1_13;
    s1_7->s1_13;
    s1_4->s1_7;
    s1_6->s1_9->s1_11->s1_12;
    s1_11->s1_10;
    s1_13->final;
}
*/
