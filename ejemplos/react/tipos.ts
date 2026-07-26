// @ts-nocheck

import React, { type FC } from "react";
/*
type FC 
Funcional Component 
*/

const x: FC = () =>
    React.createElement(
        React.Fragment,
        null,
        React.createElement("p", null, "extraText")
    );

    console.log(x)