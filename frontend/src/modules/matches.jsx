export const Matches = (props) => {
    return(
        <div className="objectMatches">
            {    
                props.items.map((item, index) => {
                    return(
                        <div key={index}>
                            {item} found
                        </div>
                    )
                })
            }
        </div>
    )
}