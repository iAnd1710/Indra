import React from 'react';
import Logo from '../../assets/img/logo192.png'
import "./styles.css"

const TitleOne = props => {

    return (
       <div className="imgTitle">
        <img src={Logo} alt="Indra" width="500"/>
       </div>
    );
};

export default TitleOne;
