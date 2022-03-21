import Modal from 'react-modal';
import React,{useEffect,useState}  from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io.connect("https://groupyy.herokuapp.com/")
Modal.setAppElement('#root');
const customStyles = {
  content: {
    

  },
};

function App() {
  const [msg, setMsg] = useState("")
  const [chat, setChat] = useState([])
  const [isopen, setIsopen] = useState(true)
  const [name, setName] = useState("")

  //connecting to the socket io server
  function sendMsg(e){
    e.preventDefault()
    socket.emit("sendchat",msg)
    setMsg("")
    const sentmsg = "You " + " "+ msg
    setChat([...chat, sentmsg])

  }

  //catching the server response related to send the msg

  useEffect(() => {
    socket.on("chat",payload=>{
      setChat([...chat, payload])
    })
  })

  useEffect(() => {
    socket.on("userdisconnected",payload=>{
      setChat([...chat, payload])
    })
  })
  
  function setUser (){
    const youjoin= "you joined the chat"
    setChat([...chat, youjoin ])
    socket.emit("newuser",name)
  }

  useEffect(() => {
    socket.on("userconnected",payload=>{
      
      setChat([...chat, payload])
      console.log(payload)
    })
  })





  return (
    <div className="App">
      

      <header className="App-header">


 <Modal isOpen={isopen} 
         className="modal" >

   <input type="text" name="name" id="name" value={name}  onChange={(e)=>{
           setName(e.target.value)
         }}  placeholder='Enter your name'/>

   <button onClick={()=>{
     setIsopen(false)
     setUser() 
     

   }}>Save</button>

 </Modal>








       <h2>Groupy</h2>

       <div className="card">

         
       {
         chat.map((item,index)=>{
           return(
            <h2 key={index}>{item}</h2>
           )
          
         })
       }

       </div>


       <form onSubmit={sendMsg} >

        
         <input value={msg} type="text" placeholder='type msg' onChange={(e)=>{
           setMsg(e.target.value)
         }}/>
         <button type='submit'>Send</button>
       </form>
      </header>
    </div>
  );
}

export default App;
