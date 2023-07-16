export const Status = props => {
   return(
      <div className = {props.message.type}>
         {
            typeof props.message.text === "string"
            ? props.message.text
            : (props.message.text.map((item, i) => {
                  return(
                     <div key={i} className = "predictionItem">
                        {item}
                     </div>
                  )
               })
            )
         }
      </div>
   )
}