import React, { useState } from "react";
import styled from "styled-components";
import LastArrivalItems from "../LastArrivalList/LastArrivalItems";

const LastArrivalList = () => {
  const LastArrivalSection = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
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
      width: 100%;
    }
  `;
  const AnswerDiv = styled.div`
    min-width: 80%;
  `;
  const ReloadImgTag = styled.img`
    height: 50px;
    width: 50px;
    margin-left: 10px;
    cursor: pointer;
  `;
  // * ---------- STATES --------- *
  const [employeeList, setEmployeeList] = useState([]);
  const [isListIsLoad, setIsListIsLoad] = useState(false);

  const searchForLastEntries = () => {
    if (!isListIsLoad) {
      fetch("http://127.0.0.1:5000/get_5_last_entries")
        .then((response) => response.json())
        .then((response) => {
          if (response) {
            setEmployeeList(response);
            setIsListIsLoad(true);
          }
        });
    }
  };
  const LastEntriestAnswer = (props) => {
    let obj = props.answer;
    let answerList = Object.keys(obj).map((key) => {
      return <LastArrivalItems result={obj[key]} />;
    });
    return answerList;
  };
  searchForLastEntries();

  return (
    <LastArrivalSection className="some-space">
      <h2>Últimos acessos</h2>
      
      <AnswerDiv>
        {/* Show user's data if user found */}
        {employeeList && !employeeList["error"] ? (
          <LastEntriestAnswer answer={employeeList} />
        ) : null}
        {/* Show an error if user is not found */}
        {employeeList["error"] ? <p>Usuário não encontrado...</p> : null}
      </AnswerDiv>
    </LastArrivalSection>
  );
};

export default LastArrivalList;