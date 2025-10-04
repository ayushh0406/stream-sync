exports.validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

exports.validatePassword = (password) => {
  return password && password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

exports.sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '');
};