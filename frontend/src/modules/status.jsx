export const Status = props => {
   return(
      <div className = {props.message.type}>
         {props.message.text}
      </div>
   )
}