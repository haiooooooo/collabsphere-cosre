import React from 'react';

  import MemberInfoCard from './MemberInfoCard';
  import NotSubmittedByContent from './NotSubmittedByContent.js'

function createContactCard(Contact)
{
    return(
        <MemberInfoCard name={Contact.name} email={Contact.email}/>
    );
}
const SubmittedBy = (props) => {
  return (
    <div>
    {props.list.map(createContactCard)}
    </div>
  )
}

export default SubmittedBy