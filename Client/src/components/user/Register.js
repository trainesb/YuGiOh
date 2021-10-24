import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../App'
import { validatePhone, validateEmail, validateUsername } from '../../services/Validator'


const Register = () => {
  const { dispatch } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneProvider, setPhoneProvider] = useState('@txt.att.net')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    let rtrn = validateUsername(username)
    if(!rtrn.valid) {
      alert(rtrn.error)
    } else {
      rtrn = validatePhone(phone)
      if(!rtrn.valid) {
        alert(rtrn.error)
      } else {
        if(password !== confirmPassword) {
          alert('Both password and confirmPassword must match!')
        } else {

          const headers = {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              username: username,
              phone: phone,
              phoneProvider: phoneProvider,
              email: email,
              password: password
            })
          }

          fetch('/api/register', headers)
            .then(response => response.json())
            .then(data => {
              if(data.status) {
                alert("Registration Successful, please check your email to validate your account and finish user registration!")
                window.location.assign('/validate/' + username)
              } else {
                alert(data.error)
              }
            })

        }
      }
    }
  }

  return (
    <div className="register-wrapper">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Register</h2>
        <hr />
        <label for="username">Username:</label>
        <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} />
        <br />

        <label for="phone">Phone Number:</label>
        <input type="tel" name="phone" onChange={(e) => setPhone(e.target.value)} />
        <br />

        <label for="phone-provider">Phone Provider:</label>
        <select name="phone-provider" onChange={(e) => setPhoneProvider(e.target.value)} defaultValue={phoneProvider}>
          <option value="@txt.att.net">AT&T</option>
          <option value="@pm.sprint.com">Sprint</option>
          <option value="@tmomail.net">T-Mobile</option>
          <option value="@vtext.com">Verizon</option>
          <option value="@myboostmobile.com">Boost Mobile</option>
          <option value="@sms.mycricket.com">Cricket</option>
          <option value="@mymetropcs.com">Metro PCS</option>
          <option value="@mmst5.tracfone.com">Tracefone</option>
          <option value="@email.uscc.net">U.S. Cellular</option>
          <option value="@vmobl.com">Virgin Mobile</option>
        </select>
        <br />

        <label for="email">Email:</label>
        <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} />
        <br />

        <label for="password">Password:</label>
        <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
        <br />

        <label for="confirm-password">Confirm Password:</label>
        <input type="password" name="confirm-password" onChange={(e) => setConfirmPassword(e.target.value)} />
        <br />

        <input type="submit" value="Register" />
        <hr />
      </form>

      <button className="login-btn"><Link to='/login'>Login</Link></button>
    </div>
  )
}
export default Register
