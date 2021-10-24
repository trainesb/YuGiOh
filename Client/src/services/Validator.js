
class Validator {

  validatePhone(phone) {
    if(typeof phone !== "undefined" && phone.length > 0) {
      let pattern = new RegExp(/^[0-9\b]+$/)
      if(!pattern.test(phone)) {
        return {valid: false, error: 'Please enter only numbers for phone number!'}
      } else if(phone.length != 10) {
        return {valid: false, error: 'Please enter valid phone number!'}
      }
      return {valid: true}
    } else {
      return {valid: false, error: 'Phone number is undefined!'}
    }
  }

  validateEmail(email) {
    if(typeof email !== "undefined" && email.length > 0) {
      let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

      if (!pattern.test(email)) {
        return {valid: false, error: 'Please enter valid email!'}
      }
      return {valid: true}
    } else {
      return {valid: false, error: 'Email is undefined!'}
    }
  }

  validateUsername(username) {
    if(typeof username !== "undefined" && username.length > 0) {
      return {valid: true}
    } else {
      return {valid: false, error: 'Username is undefined!'}
    }
  }

  validatePassword(password) {
    if(typeof password !== "undefined" && password.length > 0) {
      return {valid: true}
    } else {
      return {valid: false, error: 'Password is undefined!'}
    }
  }
}
export const { validatePhone, validateEmail, validatePassword, validateUsername } = new Validator()
