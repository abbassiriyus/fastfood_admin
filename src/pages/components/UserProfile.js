import { useEffect, useState } from 'react';
import styles from './styles/UserProfile.module.css'; // CSS modulini import qilish
import axios from 'axios';
import  url  from "../../host/host"
const UserProfile = () => {
  const [name, setName] = useState('Ismingiz');
  const [phone_number, setPhone_number] = useState('email@example.com');
  const [user, setUser] = useState({});
const [file_type,setFile_type]=useState("text")
useEffect(()=>{
if(localStorage.getItem('user')){
setUser(JSON.parse(localStorage.getItem('user')))
}

},[])
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Ma'lumotlar saqlandi!");
  };
  const SelectFile=(data)=>{
if(data){
setFile_type("file")
}else{
  setFile_type("text")
}
  }
  const PutData=()=>{
    var formdata=new FormData()
formdata.append('username',document.querySelector('#username').value)
formdata.append('description',document.querySelector('#description').value)
formdata.append('phone_number',document.querySelector('#phone_number').value)

if(document.querySelector('#data_file').type=='text'){
  formdata.append('image',document.querySelector('#data_file').value)

}else{
  formdata.append('image',document.querySelector('#data_file').files[0])

}
axios.put(`${url}/users/fastfood/${user.id}`,formdata).then(res=>{
setUser(res.data)
alert('Malumot yangilandi')
}).catch(err=>{
console.log(err);
alert('xatolik yuz beridi! Mutahasis bilan bog`laning.')
})
}

  return (
    <div className={styles.userProfile}>
      <h2 className={styles.userProfileTitle}>Shaxsiy Ma'lumotlar</h2>
      <form className={styles.userProfileForm} onSubmit={handleSubmit}>
        <div className={styles.userProfileField}>
          <label className={styles.userProfileLabel}>Ism:</label>
        <br />  <input 
            className={styles.userProfileInput} 
            type="text" 
            id='username'
            defaultValue={user.username} 
            required 
          />
        </div>
        <div className={styles.userProfileField}>
          <label className={styles.userProfileLabel}>Telefon nomer:</label>
          <br /><input 
            className={styles.userProfileInput} 
            type="tel" 
            id='phone_number'
            defaultValue={user.phone_number} 
            required 
          />
          
        </div>
        <div className={styles.userProfileField}>
          <label className={styles.userProfileLabel}>Men haqimda:</label>
          <br /><input 
            className={styles.userProfileInput} 
            type="text" 
            id='description'
            defaultValue={user.description} 
            required 
          />
        </div>
        <div className={styles.userProfileField}>
          <label className={styles.userProfileLabel} >Image: <input onChange={(e)=>SelectFile(e.target.checked)} type="checkbox" name="" id="" />  <span>file</span></label>
         <br />
          <input 
            className={styles.userProfileInput} 
            type={file_type=="file"?"file":'text'} 
            id='data_file'
            defaultValue={user.image} 
            required 
          />
        </div>
        
      </form>
      <br />
      <button className={styles.userProfileButton} onClick={()=>PutData()} type="button">Saqlash</button>
    </div>
  );
};

export default UserProfile;