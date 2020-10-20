import React, { useState } from 'react';
import styled from 'styled-components'


const AddEmployeeForm = props => {

    // * ----------- STYLE ---------- *
    const AddEmployeeForm = styled.div`
      display: flex;
      flex-direction: column;
      width: 100%;
`
    const AddEmployeeInput = styled.input`
         margin-bottom: 20px;
`
    const AddEmployeeInputText = styled.input`
        width: 50%;
        margin-bottom: 14px;
        outline: 0;
        border-width: 0 0 1px;
        border-color: #5876ad;
        border-radius: 7px 7px;
        padding: 8px;
        font-size: 15px;
`
    const AddEmployeeButton = styled.button`
        width: 15%;
        padding: 10px 20px;
        background: #5876ad;
        border: none;
        border-radius: 10px;
        color: #ffffff;
        font-weight: bold;
        font-size: 18px;
        margin-top: 10px;
        margin-bottom: 15px;
        cursor: pointer;
        &:hover {
            opacity: 0.6;
    }
`
    const SuccessAddUser = styled.p`
        padding: 10px;
        color: #25AD47;
        font-weight: bold;
    `
    const ConstErrorAddUser = styled.p`
        padding: 10px;
        color: #E62727;
        font-weight: bold;
`
    const H3AddEmployee = styled.h3`
        display: flex;
        align-items: center;
        color: #A6A6A6;
`

    // * ----------- STATES ---------- *
    const [isUserWellAdded, setIsUserWellAdded] = useState(false);
    const [errorWhileAddingUser, seterrorWhileAddingUser] = useState(false);

    const addEmployeeToDb = e => {
        e.preventDefault()
        // Mandar para o backend -> add_employee como POST request
        let name = document.getElementById("nameOfEmployee").value
        let picture = document.getElementById('employeePictureToSend')

        let formData  = new FormData();

        formData.append("nameOfEmployee", name)
        formData.append("image", picture.files[0])

        fetch('http://127.0.0.1:5000/add_employee',{
            method: 'POST',
            body:  formData,
        })
            .then(reposonse => reposonse.json())
            .then(response => {
                console.log(response)
                setIsUserWellAdded(true)
            })
            .catch(error => seterrorWhileAddingUser(true))
    }

    return (
        <section>
            <H3AddEmployee>Adicione um funcionário</H3AddEmployee>
            <AddEmployeeForm>
                <AddEmployeeInputText id="nameOfEmployee" name="name" placeholder='Nome' type="text" />
                <AddEmployeeInput type="file" alt="employee" id='employeePictureToSend' name='employeePictureToSend' />
                <AddEmployeeButton onClick={ addEmployeeToDb }>ADICIONAR</AddEmployeeButton>
                { isUserWellAdded && <SuccessAddUser>O usuário foi adicionado ao Banco de Dados com sucesso!</SuccessAddUser> }
                { errorWhileAddingUser && <ConstErrorAddUser>O usuário não foi adicionado. Por favor, tente mais tarde...</ConstErrorAddUser> }
            </AddEmployeeForm>
        </section>
    );
};

export default AddEmployeeForm;