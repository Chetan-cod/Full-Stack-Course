const toggleBtn = document.getElementById("themeToggle");
const body = document.body;


const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  body.classList.add("light");
  toggleBtn.textContent = "🌞 Light Mode";
}


toggleBtn.addEventListener("click", () => {
  body.classList.toggle("light");

  if (body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "🌞 Light Mode";
  } else {
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "🌙 Dark Mode";
  }
});
