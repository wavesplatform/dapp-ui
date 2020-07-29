import styled from "@emotion/styled";

const Input = styled.input`
outline: none;
border: none;
background: #F4F6FA;
border-radius: 4px;
height: 40px;
width: 100%;
padding: 0 10px;
font-family: Roboto;
font-size: 14px;
line-height: 16px;
color: #6F7582;

${(props: any) => props.css}
`;

export default Input
