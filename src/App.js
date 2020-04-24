import React, {useEffect, useState, useRef} from 'react';
import io from 'socket.io-client'

let socket;

function App() {
    const inputRef = useRef();

    const [onoff, setonoff] = useState(0);
    const [clientname, setClientname] = useState('');

    const [clickedList,setClickedList] = useState([]);
    useEffect(() => {
        socket = io('http://localhost:8080');
        socket.on("switch", data => {
            setonoff(!onoff);
        });
        socket.on("switchdata", data =>{
            setClickedList((state)=> {
                return [...state, <div>{`${data.clientName} has switched state to ${Number(data.currentValue)}`}</div>]
            })
        })
        socket.on("serverswitch", (data) => {
            setonoff(Number(data));
        });


    }, [])
    const inputEvent = () => {
        setClientname(inputRef.current.value);
        socket.emit('init', inputRef.current.value);
    }
    const switchEvent = () => {
        socket.emit('clientswitch', !onoff);
        setonoff(Number(!onoff))
    }

    return (
        <>

            {clientname ?
                (<div>
                    {onoff}
                    <br/>
                    <button onClick={switchEvent}>Switch</button>
                    <br/>
                    {clickedList}
                    {clickedList.forEach(value=><div>{value}</div>)}
                </div>)
                :
                (<div>
                    <input ref={inputRef}></input>
                    <button onClick={inputEvent}>Submit</button>
                </div>)
            }
        </>
    );
}

export default App;
