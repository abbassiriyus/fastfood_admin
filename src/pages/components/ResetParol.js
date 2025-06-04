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

  const PutData=()=>{
    var formdata=new FormData()

    if(document.querySelector('#reset_password').value==document.querySelector('#new_password').value){
        formdata.append('oldPassword',document.querySelector('#old_password').value)
        formdata.append('newPassword',document.querySelector('#new_password').value)
        formdata.append('token',localStorage.getItem('token'))

        axios.post(`${url}/users/reset-password`,formdata).then(res=>{
alert('Malumot yangilandi')
}).catch(err=>{
console.log(err);
alert('xatolik yuz beridi! Mutahasis bilan bog`laning.')
})
    }else{
        alert('Parol takrorlashda xato qildingiz')
    }




}

  return (
    <div className={styles.userProfile}>
      <h2 className={styles.userProfileTitle}>Shaxsiy Ma'lumotlar</h2>
        <div className={styles.userProfileField} style={{marginBottom:'20px'}}>
          <label className={styles.userProfileLabel}>Eski Parolni kiriting:</label>
        <br />  <input 
            className={styles.userProfileInput} 
            type="password" 
            id='old_password'
          
            required 
          />
        </div>
        <div className={styles.userProfileField} style={{marginBottom:'20px'}}>
          <label className={styles.userProfileLabel}>Yangi Parolni kiriting:</label>
          <br /><input 
            className={styles.userProfileInput} 
            type="password" 
            id='new_password'
            required 
          />
          
        </div>
        <div className={styles.userProfileField} style={{marginBottom:'20px'}}>
          <label className={styles.userProfileLabel}>Yangi Parolni takrorlang:</label>
          <br /><input 
            className={styles.userProfileInput} 
            type="password" 
            id='reset_password'
            required 
          />
          
        </div>
 
        
      <br />
      <button className={styles.userProfileButton} onClick={()=>PutData()} type="button">Saqlash</button>
    </div>
  );
};

export default UserProfile;