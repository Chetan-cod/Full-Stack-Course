const fs = require("fs");
const readline = require("readline");

const FILE = "employees.json";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function loadEmployees() {
  try {
    const data = fs.readFileSync(FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveEmployees(employees) {
  fs.writeFileSync(FILE, JSON.stringify(employees, null, 2));
}

function ask(q) {
  return new Promise((res) => rl.question(q, (ans) => res(ans.trim())));
}

function generateId() {
  return Date.now();
}

function showMenu() {
  console.log("\nEmployee Management System");
  console.log("1. Add Employee");
  console.log("2. List Employees");
  console.log("3. Update Employee");
  console.log("4. Delete Employee");
  console.log("5. Exit");
}

async function addEmployee(employees) {
  const name = await ask("Employee Name: ");
  const position = await ask("Position: ");
  const salaryStr = await ask("Salary: ");

  if (!name || !position || !salaryStr) {
    console.log("Invalid input! All fields are required.");
    return;
  }

  const salary = Number(salaryStr);

  if (isNaN(salary) || salary <= 0) {
    console.log("Salary must be a valid number.");
    return;
  }

  employees.push({
    id: generateId(),
    name,
    position,
    salary,
  });

  saveEmployees(employees);
  console.log("Employee added successfully!");
}

function listEmployees(employees) {
  console.log("\nEmployee List:");

  if (employees.length === 0) {
    console.log("No employees found.");
    return;
  }

  employees.forEach((e) => {
    console.log(
      `ID: ${e.id}, Name: ${e.name}, Position: ${e.position}, Salary: $${e.salary}`
    );
  });

  console.log(`Total employees: ${employees.length}`);
}

async function updateEmployee(employees) {
  const idStr = await ask("Enter Employee ID to update: ");
  const id = Number(idStr);

  if (isNaN(id)) {
    console.log("Invalid ID!");
    return;
  }

  const emp = employees.find((e) => e.id === id);

  if (!emp) {
    console.log("Employee not found!");
    return;
  }

  const newName = await ask(`New Name (${emp.name}): `);
  const newPosition = await ask(`New Position (${emp.position}): `);
  const newSalaryStr = await ask(`New Salary (${emp.salary}): `);

  if (newName) emp.name = newName;
  if (newPosition) emp.position = newPosition;

  if (newSalaryStr) {
    const newSalary = Number(newSalaryStr);
    if (isNaN(newSalary) || newSalary <= 0) {
      console.log("Invalid salary! Update cancelled.");
      return;
    }
    emp.salary = newSalary;
  }

  saveEmployees(employees);
  console.log("Employee updated successfully!");
}

async function deleteEmployee(employees) {
  const idStr = await ask("Enter Employee ID to delete: ");
  const id = Number(idStr);

  if (isNaN(id)) {
    console.log("Invalid ID!");
    return;
  }

  const index = employees.findIndex((e) => e.id === id);

  if (index === -1) {
    console.log("Employee not found!");
    return;
  }

  employees.splice(index, 1);
  saveEmployees(employees);
  console.log("Employee deleted successfully!");
}

async function main() {
  const employees = loadEmployees();

  while (true) {
    showMenu();
    const choice = await ask("Select an option: ");

    if (choice === "1") await addEmployee(employees);
    else if (choice === "2") listEmployees(employees);
    else if (choice === "3") await updateEmployee(employees);
    else if (choice === "4") await deleteEmployee(employees);
    else if (choice === "5") {
      console.log("Exiting...");
      rl.close();
      break;
    } else {
      console.log("Invalid choice! Try again.");
    }
  }
}

main();
