import React, { useState } from 'react';
import styled from 'styled-components'

// IMPORT IMG
import realodImg from "../../assets/img/reload.png"

const EmployeeToDeleteList = props => {
    // * ---------- STYLE ---------- *
        const ItemLi = styled.li`
            list-style: none;
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            margin-bottom: 10px;
            background: rgba(242, 242, 242, 0.5);
            padding: 10px;
            border-radius: 5px;
            margin-right: 2.8%;
`
        const ItemButton = styled.button`
            background: #f73131;
            color: #fff;
            font-weight: bold;
            border: none;
            border-radius: 3px;
            padding: 5px 10px;
            cursor: pointer;
            margin-left: 10px;
`
    const ReloadImgTag = styled.img`
        height: 30px;
        margin-left: 10px;
        cursor: pointer;
`
    const H3WithReload = styled.h3`
    display: flex;
    align-items: center;
    color: #A6A6A6;
`


    // * ---------- SATES --------- *
    const [nameList, setNameList] = useState({});
    const [isEmployeeListLoaded, setIsEmployeeListLoaded] = useState(false);

    // Pegando a lista de todos os funcionarios da API
    const getEmployeeList = () => {
        fetch('http://127.0.0.1:5000/get_employee_list')
            .then(response => response.json())
            .then (response =>{
                if(!isEmployeeListLoaded){
                    setNameList(response)
                    setIsEmployeeListLoaded(true)
                }
            })
    }
    getEmployeeList()

    // Componente que vai mapear todos os nomes dos funcionarios
    const EmployeeListItem = props => {
        let obj = props.list
        let employeeList = Object.keys(obj).map(key => {
            return <EmployeeItem name={ obj[key] } />
        })
        return employeeList
    }

    // Componente que contem os nomes de funcionarios e um botão para deleta-los
    const EmployeeItem = props => {

        // Função para enviar o nome de funcionario para apagar
        const deleteEmployee = name => {
            fetch(`http://127.0.0.1:5000/delete_employee/${name}`)
                .then(response => response.json())
                .then(() => setIsEmployeeListLoaded(false))
        }
        return(
            <ItemLi> { props.name } <ItemButton onClick={ () => deleteEmployee(props.name) }>DELETE</ItemButton></ItemLi>
        )
    }

    return (
        <section>
            <H3WithReload> Apagar um funcionário <ReloadImgTag onClick={ () => setIsEmployeeListLoaded(false) } src={ realodImg } alt="reload"/> </H3WithReload>
            <ul>
                { nameList ? <EmployeeListItem list={ nameList } /> : null}
            </ul>
        </section>
    );
};

export default EmployeeToDeleteList;