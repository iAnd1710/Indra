import React, { useState } from "react";
import styled from "styled-components";

// * --------- COMPONENTS --------- *
import SearchBarResult from "./SearchBarResult";

const SearchBar = (props) => {
  // * ---------- STATES ---------- *
  const [employeeList, setEmployeeList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  // * ---------- STYLE ---------- *
  const SearchSection = styled.section`
    display: flex;
    flex-direction: column;
    margin: 40px 10px;
    background-color: #0e0e0e;
    padding: 10px;
    width: 100%;
    border-radius: 20px;
    height: auto;
    border-radius: 20px;
    border: 5px solid #5876ad;
     h2 {
      margin-top: 10px;
      margin-bottom: 70px;
      font-size: 45px;
      line-height: 1;
      color: #A6A6A6;
      text-align: left;
    }
  `;
  const SearchContainer = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
  `;
  const AnswerDiv = styled.div`
    min-width: 80%;
  `;
  const SearchInput = styled.input`
    width: 50%;
    margin-bottom: 14px;
    outline: 0;
    border-width: 0 0 1px;
    border-color: #5876ad;
    border-radius: 7px 7px;
    padding: 8px;
    font-size: 15px;
  `;
  const SearchButton = styled.button`
    width: 15%;
    padding: 10px 20px;
    background: #5876ad;
    border: none;
    border-radius: 10px;
    color: #ffffff;
    font-weight: bold;
    font-size: 18px;
    margin: 0;
    margin-bottom: 15px;
    cursor: pointer;
    &:hover {
      opacity: 0.6;
    }
  `;
  const FormDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 90%;
  `;

  const searchForEmployee = () => {
    const name = document
      .getElementById("searchForEmployee")
      .value;
    if (name) {
      fetch(`http://127.0.0.1:5000/get_employee/${name}`)
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          if (response) {
            setEmployeeList(response);
          } else {
            setErrorMessage(response.Error);
          }
        });
    } else {
      setEmployeeList(["Nome não encontrado..."]);
    }
  };
  const SearchListAnswer = (props) => {
    let obj = props.answer;
    let answerList = Object.keys(obj).map((key) => {
      return <SearchBarResult result={obj[key]} />;
    });
    return answerList;
  };

  return (
    <SearchSection>
      <h2>Funcionários</h2>
      <SearchContainer>
        <FormDiv>
          <SearchInput
            name="searchForEmployee"
            id="searchForEmployee"
            placeholder="Digite o nome do funcionário aqui!"
            type="text"
          />
          <SearchButton onClick={searchForEmployee} id="searchButton">
            PESQUISAR
          </SearchButton>
        </FormDiv>
        <AnswerDiv>
          {/* mostrar dados */}
          {employeeList && !employeeList["error"] ? (
            <SearchListAnswer answer={employeeList} />
          ) : null}

          {/* mostrar erro caso o usuario n seja encontrado */}
          {employeeList["error"] ? <p>Usuário não encontrado...</p> : null}
        </AnswerDiv>
      </SearchContainer>
    </SearchSection>
  );
};

export default SearchBar;