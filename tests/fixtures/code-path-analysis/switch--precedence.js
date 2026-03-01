/*expected
initial->s2_1->s2_2->s2_3->s2_9->s2_10->s2_12->s2_13->s2_15->s2_16->s2_17->s2_19->s2_20->s2_21->s2_23->s2_24->s2_25->s2_27->s2_28->s2_30->s2_31->s2_39->s2_40->s2_52->s2_53->s2_59->s2_60->s2_64->s2_65->s2_71->s2_72->s2_73->s2_75->s2_76->s2_78->s2_79->s2_81->s2_82->s2_83->s2_84->s2_85->s2_87->s2_88->s2_89->s2_90;
s2_1->s2_4->s2_6->s2_8->s2_9;
s2_15->s2_18->s2_19;
s2_23->s2_26->s2_27;
s2_81->s2_84;
s2_4->s2_9;
s2_6->s2_9;
s2_8->s2_11->s2_12;
s2_18->s2_21;
s2_26->s2_29->s2_30;
s2_11->s2_14->s2_15;
s2_29->s2_32->s2_34->s2_36->s2_38->s2_39;
s2_14->s2_22->s2_23;
s2_32->s2_39;
s2_34->s2_39;
s2_36->s2_39;
s2_38->s2_41->s2_43->s2_45->s2_47->s2_49->s2_51->s2_52;
s2_22->s2_74->s2_75;
s2_41->s2_52;
s2_43->s2_52;
s2_45->s2_52;
s2_47->s2_52;
s2_49->s2_52;
s2_51->s2_54->s2_56->s2_58->s2_59;
s2_74->s2_77->s2_78;
s2_54->s2_59;
s2_56->s2_59;
s2_58->s2_61->s2_63->s2_64;
s2_77->s2_80->s2_81;
s2_61->s2_64;
s2_63->s2_66->s2_68->s2_70->s2_71;
s2_80->s2_86->s2_87;
s2_66->s2_71;
s2_68->s2_71;
s2_70->s2_73;
s2_86->s2_89;
s2_2->final;
s2_9->final;
s2_12->final;
s2_16->final;
s2_19->final;
s2_24->final;
s2_27->final;
s2_30->final;
s2_39->final;
s2_52->final;
s2_59->final;
s2_64->final;
s2_71->final;
s2_75->final;
s2_78->final;
s2_82->final;
s2_84->final;
s2_87->final;
s2_89->final;
*/
/*expected
initial->s1_1->final;
*/

function precedence(node) {
    switch (node.type) {
        case "SequenceExpression":
            return 0;

        case "AssignmentExpression":
        case "ArrowFunctionExpression":
        case "YieldExpression":
            return 1;

        case "ConditionalExpression":
            return 3;

        case "LogicalExpression":
            switch (node.operator) {
                case "||":
                    return 4;
                case "&&":
                    return 5;
                // no default
            }

            /* falls through */
        case "BinaryExpression":
            switch (node.operator) {
                case "|":
                    return 6;
                case "^":
                    return 7;
                case "&":
                    return 8;
                case "==":
                case "!=":
                case "===":
                case "!==":
                    return 9;
                case "<":
                case "<=":
                case ">":
                case ">=":
                case "in":
                case "instanceof":
                    return 10;
                case "<<":
                case ">>":
                case ">>>":
                    return 11;
                case "+":
                case "-":
                    return 12;
                case "*":
                case "/":
                case "%":
                    return 13;
                // no default
            }
            /* falls through */
        case "UnaryExpression":
            return 14;
        case "UpdateExpression":
            return 15;
        case "CallExpression":
            // IIFE is allowed to have parens in any position (#655)
            if (node.callee.type === "FunctionExpression") {
                return -1;
            }
            return 16;
        case "NewExpression":
            return 17;
        // no default
    }
    return 18;
}

/*DOT
digraph {
    node[shape=box,style="rounded,filled",fillcolor=white];
    initial[label="",shape=circle,style=filled,fillcolor=black,width=0.25,height=0.25];
    final[label="",shape=doublecircle,style=filled,fillcolor=black,width=0.25,height=0.25];
    s2_1[label="FunctionDeclaration\nIdentifier (precedence)\nIdentifier (node)\nBlockStatement\nSwitchStatement\nMemberExpression\nIdentifier (node)\nIdentifier (type)\nSwitchCase\nLiteral (SequenceExpression)"];
    s2_2[label="ReturnStatement\nLiteral (0)"];
    s2_3[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_9[label="ReturnStatement\nLiteral (1)"];
    s2_10[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_12[label="ReturnStatement\nLiteral (3)"];
    s2_13[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_15[label="SwitchStatement\nMemberExpression\nIdentifier (node)\nIdentifier (operator)\nSwitchCase\nLiteral (||)"];
    s2_16[label="ReturnStatement\nLiteral (4)"];
    s2_17[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_19[label="ReturnStatement\nLiteral (5)"];
    s2_20[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_21[label="SwitchStatement:exit\nSwitchCase:exit"];
    s2_23[label="SwitchStatement\nMemberExpression\nIdentifier (node)\nIdentifier (operator)\nSwitchCase\nLiteral (|)"];
    s2_24[label="ReturnStatement\nLiteral (6)"];
    s2_25[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_27[label="ReturnStatement\nLiteral (7)"];
    s2_28[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_30[label="ReturnStatement\nLiteral (8)"];
    s2_31[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_39[label="ReturnStatement\nLiteral (9)"];
    s2_40[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_52[label="ReturnStatement\nLiteral (10)"];
    s2_53[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_59[label="ReturnStatement\nLiteral (11)"];
    s2_60[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_64[label="ReturnStatement\nLiteral (12)"];
    s2_65[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_71[label="ReturnStatement\nLiteral (13)"];
    s2_72[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_73[label="SwitchStatement:exit\nSwitchCase:exit"];
    s2_75[label="ReturnStatement\nLiteral (14)"];
    s2_76[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_78[label="ReturnStatement\nLiteral (15)"];
    s2_79[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_81[label="IfStatement\nBinaryExpression\nMemberExpression\nMemberExpression\nIdentifier (node)\nIdentifier (callee)\nIdentifier (type)\nLiteral (FunctionExpression)"];
    s2_82[label="BlockStatement\nReturnStatement\nUnaryExpression\nLiteral (1)"];
    s2_83[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit"];
    s2_84[label="ReturnStatement\nLiteral (16)"];
    s2_85[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_87[label="ReturnStatement\nLiteral (17)"];
    s2_88[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nSwitchCase:exit"];
    s2_89[label="ReturnStatement\nLiteral (18)"];
    s2_90[style="rounded,dashed,filled",fillcolor="#FF9800",label="<<unreachable>>\nBlockStatement:exit\nFunctionDeclaration:exit"];
    s2_4[label="SwitchCase\nLiteral (AssignmentExpression)"];
    s2_6[label="SwitchCase\nLiteral (ArrowFunctionExpression)"];
    s2_8[label="SwitchCase\nLiteral (YieldExpression)"];
    s2_18[label="SwitchCase\nLiteral (&&)"];
    s2_26[label="SwitchCase\nLiteral (^)"];
    s2_11[label="SwitchCase\nLiteral (ConditionalExpression)"];
    s2_29[label="SwitchCase\nLiteral (&)"];
    s2_14[label="SwitchCase\nLiteral (LogicalExpression)"];
    s2_32[label="SwitchCase\nLiteral (==)"];
    s2_34[label="SwitchCase\nLiteral (!=)"];
    s2_36[label="SwitchCase\nLiteral (===)"];
    s2_38[label="SwitchCase\nLiteral (!==)"];
    s2_22[label="SwitchCase\nLiteral (BinaryExpression)"];
    s2_41[label="SwitchCase\nLiteral (<)"];
    s2_43[label="SwitchCase\nLiteral (<=)"];
    s2_45[label="SwitchCase\nLiteral (>)"];
    s2_47[label="SwitchCase\nLiteral (>=)"];
    s2_49[label="SwitchCase\nLiteral (in)"];
    s2_51[label="SwitchCase\nLiteral (instanceof)"];
    s2_74[label="SwitchCase\nLiteral (UnaryExpression)"];
    s2_54[label="SwitchCase\nLiteral (<<)"];
    s2_56[label="SwitchCase\nLiteral (>>)"];
    s2_58[label="SwitchCase\nLiteral (>>>)"];
    s2_77[label="SwitchCase\nLiteral (UpdateExpression)"];
    s2_61[label="SwitchCase\nLiteral (+)"];
    s2_63[label="SwitchCase\nLiteral (-)"];
    s2_80[label="SwitchCase\nLiteral (CallExpression)"];
    s2_66[label="SwitchCase\nLiteral (*)"];
    s2_68[label="SwitchCase\nLiteral (/)"];
    s2_70[label="SwitchCase\nLiteral (%)"];
    s2_86[label="SwitchCase\nLiteral (NewExpression)"];
    initial->s2_1->s2_2->s2_3->s2_9->s2_10->s2_12->s2_13->s2_15->s2_16->s2_17->s2_19->s2_20->s2_21->s2_23->s2_24->s2_25->s2_27->s2_28->s2_30->s2_31->s2_39->s2_40->s2_52->s2_53->s2_59->s2_60->s2_64->s2_65->s2_71->s2_72->s2_73->s2_75->s2_76->s2_78->s2_79->s2_81->s2_82->s2_83->s2_84->s2_85->s2_87->s2_88->s2_89->s2_90;
    s2_1->s2_4->s2_6->s2_8->s2_9;
    s2_15->s2_18->s2_19;
    s2_23->s2_26->s2_27;
    s2_81->s2_84;
    s2_4->s2_9;
    s2_6->s2_9;
    s2_8->s2_11->s2_12;
    s2_18->s2_21;
    s2_26->s2_29->s2_30;
    s2_11->s2_14->s2_15;
    s2_29->s2_32->s2_34->s2_36->s2_38->s2_39;
    s2_14->s2_22->s2_23;
    s2_32->s2_39;
    s2_34->s2_39;
    s2_36->s2_39;
    s2_38->s2_41->s2_43->s2_45->s2_47->s2_49->s2_51->s2_52;
    s2_22->s2_74->s2_75;
    s2_41->s2_52;
    s2_43->s2_52;
    s2_45->s2_52;
    s2_47->s2_52;
    s2_49->s2_52;
    s2_51->s2_54->s2_56->s2_58->s2_59;
    s2_74->s2_77->s2_78;
    s2_54->s2_59;
    s2_56->s2_59;
    s2_58->s2_61->s2_63->s2_64;
    s2_77->s2_80->s2_81;
    s2_61->s2_64;
    s2_63->s2_66->s2_68->s2_70->s2_71;
    s2_80->s2_86->s2_87;
    s2_66->s2_71;
    s2_68->s2_71;
    s2_70->s2_73;
    s2_86->s2_89;
    s2_2->final;
    s2_9->final;
    s2_12->final;
    s2_16->final;
    s2_19->final;
    s2_24->final;
    s2_27->final;
    s2_30->final;
    s2_39->final;
    s2_52->final;
    s2_59->final;
    s2_64->final;
    s2_71->final;
    s2_75->final;
    s2_78->final;
    s2_82->final;
    s2_84->final;
    s2_87->final;
    s2_89->final;
}
*/
