function togglePasswordVisibility() {
  const passwordInput = document.querySelector('input[name="password"]');
  const toggleIcon = document.querySelector(".toggle-password");
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  toggleIcon.textContent = type === "password" ? "👁️" : "👁️‍🗨️";
}

document
  .querySelector('input[name="password"]')
  .addEventListener("blur", function () {
    const passwordInput = this;
    const errorMessage = document.getElementById("error-message");
    if (!passwordInput.value) {
      errorMessage.style.display = "block";
    } else {
      errorMessage.style.display = "none";
    }
  });
