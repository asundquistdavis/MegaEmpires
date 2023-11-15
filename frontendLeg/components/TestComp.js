import React, { useState } from "react";

export default function TestComp(props) {

    const {} = props;

    const [testChildState, setChildState] = useState('child state')

    return <div>
        {testChildState}
    </div>
}