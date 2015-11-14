/* eslint-env node */
/*expected
initial->s1_1->s1_2->s1_3->s1_7->s1_8->s1_10->s1_12->s1_13->s1_14;
s1_1->s1_4->s1_6->s1_7;
s1_12->s1_14;
s1_4->s1_7;
s1_6->s1_9->s1_10;
s1_9->s1_11->s1_12;
s1_11->s1_14;
s1_2->final;
s1_7->final;
s1_14->final;
*/

switch (a) {
    case 0:
        foo();
        return;

    case 1:
    case 2:
        bar();
        return;

    case 3:
        hoge();
    case 4:
        fuga();
        break;
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s1_1[label="Program\nSwitchStatement\nIdentifier (a)\nSwitchCase\nLiteral (0)"];
    s1_2[label="ExpressionStatement\nCallExpression\nIdentifier (foo)\nReturnStatement"];
    s1_3[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s1_7[label="ExpressionStatement\nCallExpression\nIdentifier (bar)\nReturnStatement"];
    s1_8[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s1_10[label="ExpressionStatement\nCallExpression\nIdentifier (hoge)"];
    s1_12[label="ExpressionStatement\nCallExpression\nIdentifier (fuga)\nBreakStatement"];
    s1_13[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s1_14[label="SwitchStatement:exit\nProgram:exit"];
    s1_4[label="SwitchCase\nLiteral (1)"];
    s1_6[label="SwitchCase\nLiteral (2)"];
    s1_9[label="SwitchCase\nLiteral (3)"];
    s1_11[label="SwitchCase\nLiteral (4)"];
    initial->s1_1->s1_2->s1_3->s1_7->s1_8->s1_10->s1_12->s1_13->s1_14;
    s1_1->s1_4->s1_6->s1_7;
    s1_12->s1_14;
    s1_4->s1_7;
    s1_6->s1_9->s1_10;
    s1_9->s1_11->s1_12;
    s1_11->s1_14;
    s1_2->final;
    s1_7->final;
    s1_14->final;
}
*/
