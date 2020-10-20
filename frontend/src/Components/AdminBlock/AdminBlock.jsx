import React, { useState } from "react";
import styled from "styled-components";
import AddEmployeeForm from "./AddEmployeeForm";
import EmployeeToDeleteList from "./EmployeeToDeleteList";

const AdminBlock = () => {
  // * ---------- STYLE ---------- *
  const AdminBlockSection = styled.section`
    display: flex;
    flex-direction: column;
    margin: 40px 10px;
    background-color: #0e0e0e;
    padding: 20px;
    width: 100%;
    border-radius: 20px;
    border: 5px solid #5876ad;
    h2 {
      margin-top: 0;
      font-size: 45px;
      line-height: 1;
      color: #A6A6A6;
      text-align: left;
    }
  `;
  const ComponentsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: 40px;
  `;

  // * ---------- STATES --------- *

  return (
    <AdminBlockSection>
      <h2>Administração</h2>
      {/*Add employee form*/}
      <AddEmployeeForm />
      {/*List of employee + delete button*/}
      <EmployeeToDeleteList />
    </AdminBlockSection>
  );
};

export default AdminBlock;