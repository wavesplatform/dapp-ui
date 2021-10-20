import styled from '@emotion/styled';
import { fonts } from '@src/styles';


export const Body = styled.div`
display: flex;
margin-left: 30px;
height: 34px;
justify-content: flex-end;
align-items: center;
`;

export const BodyMobile = styled.div`
display: flex;
align-items: flex-end;
flex-direction: column;
padding: 0 10%;
width: 80%;
margin-top: -73px;
& > * {
margin: 8px 0;
}
`;

export const Wrapper = styled.div`
width: 100%;
padding-right: 10%;
display: flex;
justify-content: flex-end;

@media(max-width: 768px){
  flex: 1
}
`;

export const WrapperMobile = styled.div`
width: 70%;
padding-right: 10%;
display: flex;
justify-content: flex-end;

@media(max-width: 768px){
  flex: 1
}
`;

export const AccountDescription = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
height: 100%;
`;

export const AddressFont = styled.div`
${fonts.addressFont};
justify-content: flex-end;
`;

export const AvatarWrapper = styled.div`width: 46px`;

export const AddressContainer = styled.div`
display: flex;
`;