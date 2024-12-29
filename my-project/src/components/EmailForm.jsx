import  { useState } from 'react'
import emailjs from '@emailjs/browser'

function EmailForm() {
    const[name,setName] = useState('');
    const[email,setEmail] = useState('');
    const[message,setMessage] = useState('');

    const handleSubmit = (e) =>{
        e.preventDefault();

        const serviceId = 'service_593wa4r';
        const templateId =  'template_dgn94od';
        const publicKey  = 'Los0CORGeSoT3e7qU';

        const templateParams  = {
            from_name:name,
            from_email:email,
            to_name:'Sartup Times',
            message:message,

        }


      emailjs.send(serviceId,templateId,templateParams,publicKey)
      .then((response) => {
          console.log('SUCCESS!');
          setName('');
          setEmail('');
          setMessage('');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
    }
  return (
   <form action="submit" onSubmit={handleSubmit} className='emailForm'>

    <input type="text" 
    placeholder='Your Name'
    value={name}
    onChange={(e) => setName(e.target.value)} />

    <input type="email" 
    placeholder='email'
    value={email}
    onChange={(e) => setEmail(e.target.value)} />

    <textarea 
    cols="30"
    rows="10"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    >
    </textarea>
    
    <button type='submit'>Send Email</button>
   </form>
  )
}

export default EmailForm
