import React from 'react';
import styled from 'styled-components'

const LastArrivalItems = props => {
    // * ---------- STYLES ---------- *
    const OneResult = styled.div`
        //background: #282c34;
        //color: #fff;
        padding: 15px;
        border-radius: 6px;
        margin: 30px 0;
        min-width: 80%;
        -moz-box-shadow:    5px 0px 0px 3px #ccc;
        -webkit-box-shadow: 5px 0px 0px 3px #ccc;
        box-shadow:         0px 0px 5px 3px #a6a6a6;
`
    const ListItem = styled.li`
        list-style: none;
        margin-bottom: 5px;
        color: white;
        font-size: 20px;
`
    const UlList = styled.ul`
      min-width: 100%;
`

    return (
            <OneResult>
                <UlList>
                    <ListItem><b>Nome:</b> { props.result[1] }</ListItem>
                    <ListItem><b>Data:</b> { props.result[2] }</ListItem>
                    <ListItem><b>Hora de chegada:</b> { props.result[3] } </ListItem>
                    <ListItem><b>Hora de saída:</b> { props.result[4] } </ListItem>
                </UlList>
            </OneResult>
    );
};

export default LastArrivalItems;