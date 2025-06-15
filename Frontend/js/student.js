// File: student.js - Đã sửa lỗi cú pháp và hoạt động chuẩn

window.onload = function () {
  if (!localStorage.getItem("user")) {
    window.location.href = "../html/login.html";
    return;
  }
  renderClassOptions();
  renderListStudent();
};

function emailIsValid(email) {
  return /^\d{8}@st\.phenikaa-uni\.edu\.vn$/.test(email);
}

function save() {
  const fullname = document.getElementById("fullname").value.trim();
  const code = document.getElementById("code").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const score = document.getElementById("score").value.trim();
  const address = document.getElementById("address").value.trim();
  const className = document.getElementById("class-selector").value;
  const editId = document.getElementById("edit-id").value;
  let gender = "";
  if (document.getElementById("male").checked) gender = "1";
  if (document.getElementById("famale").checked) gender = "2";

  let isValid = true;
  if (fullname.length < 3 || fullname.length > 50) {
    document.getElementById("fullname-error").textContent = "Tên không hợp lệ"; isValid = false;
  } else document.getElementById("fullname-error").textContent = "";
  if (code.length !== 8) {
    document.getElementById("code-error").textContent = "Mã SV phải 8 ký tự"; isValid = false;
  } else document.getElementById("code-error").textContent = "";
  if (!emailIsValid(email)) {
    document.getElementById("email-error").textContent = "Email không hợp lệ"; isValid = false;
  } else document.getElementById("email-error").textContent = "";
  if (!/^\d{10}$/.test(phone)) {
    document.getElementById("phone-error").textContent = "SĐT phải 10 số"; isValid = false;
  } else document.getElementById("phone-error").textContent = "";
  if (isNaN(score) || score < 0 || score > 10) {
    document.getElementById("score-error").textContent = "Điểm không hợp lệ"; isValid = false;
  } else document.getElementById("score-error").textContent = "";
  if (!address) {
    document.getElementById("address-error").textContent = "Nhập địa chỉ"; isValid = false;
  } else document.getElementById("address-error").textContent = "";
  if (!gender) {
    document.getElementById("gender-error").textContent = "Chọn giới tính"; isValid = false;
  } else document.getElementById("gender-error").textContent = "";

  if (!isValid) return;

  let students = JSON.parse(localStorage.getItem("students") || "[]");

  if (editId !== "") {
    students[editId] = { fullname, code, email, phone, address, gender, score, className };
  } else {
    if (students.some(s => s.email === email || s.code === code)) {
      document.getElementById("email-error").textContent = "SV đã tồn tại!";
      return;
    }
    students.push({ fullname, code, email, phone, address, gender, score, className });
  }

  localStorage.setItem("students", JSON.stringify(students));
  closePopup("add-popup");
  clearForm();
  renderListStudent();
}

function clearForm() {
  ["fullname", "code", "email", "phone", "score", "address"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("male").checked = false;
  document.getElementById("famale").checked = false;
  document.getElementById("edit-id").value = "";
  document.getElementById("save-btn").innerText = "Lưu";
}

function renderListStudent() {
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  const selectedClass = document.getElementById("class-selector").value;
  const filtered = students.filter(s => s.className === selectedClass);
  const table = document.getElementById("grid-students");

  if (!selectedClass || filtered.length === 0) {
    table.innerHTML = "<tr><td colspan='9'>Chưa có sinh viên</td></tr>";
    updateStatistics([]);
    return;
  }

  let html = `<tr>
    <th>STT</th><th>Họ tên</th><th>Mã SV</th><th>Email</th><th>SĐT</th>
    <th>Điểm</th><th>Giới tính</th><th>Địa chỉ</th><th>Hành động</th>
  </tr>`;

  filtered.forEach((sv, i) => {
    const index = students.findIndex(s => s.email === sv.email);
    html += `<tr>
      <td>${i + 1}</td>
      <td>${sv.fullname}</td>
      <td>${sv.code}</td>
      <td>${sv.email}</td>
      <td>${sv.phone}</td>
      <td>${sv.score}</td>
      <td>${sv.gender === "1" ? "Nam" : "Nữ"}</td>
      <td>${sv.address}</td>
      <td>
        <a href="#" onclick="editStudent(${index})">Sửa</a> | 
        <a href="#" onclick="deleteStudent(${index})">Xóa</a>
      </td>
    </tr>`;
  });

  table.innerHTML = html;
  updateStatistics(filtered);
}

function editStudent(index) {
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  const student = students[index];
  document.getElementById("fullname").value = student.fullname;
  document.getElementById("code").value = student.code;
  document.getElementById("email").value = student.email;
  document.getElementById("phone").value = student.phone;
  document.getElementById("score").value = student.score;
  document.getElementById("address").value = student.address;
  document.getElementById(student.gender === "1" ? "male" : "famale").checked = true;
  document.getElementById("edit-id").value = index;
  document.getElementById("save-btn").innerText = "Cập nhật";
  openPopup("add-popup");
}

function deleteStudent(index) {
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  students.splice(index, 1);
  localStorage.setItem("students", JSON.stringify(students));
  renderListStudent();
}

function renderClassOptions() {
  const classes = JSON.parse(localStorage.getItem("classes") || "[]");
  const selector = document.getElementById("class-selector");
  const currentClass = localStorage.getItem("currentClass");

  selector.innerHTML = '<option value="">-- Chọn lớp --</option>';
  classes.forEach(cls => {
    const opt = document.createElement("option");
    opt.value = cls.tenLop;
    opt.textContent = cls.tenLop;
    if (cls.tenLop === currentClass) opt.selected = true;
    selector.appendChild(opt);
  });

  selector.onchange = function () {
    const selected = this.value;
    localStorage.setItem("currentClass", selected);
    updateClassInfo(selected);
    renderListStudent();
  };

  updateClassInfo(currentClass);
}

function updateClassInfo(className) {
  const classes = JSON.parse(localStorage.getItem("classes") || "[]");
  const hocPhanLabel = document.getElementById("hoc-phan-label");
  const found = classes.find(cls => cls.tenLop === className);
  hocPhanLabel.textContent = found ? `Học phần: ${found.hocPhan}` : '';
}

function updateStatistics(students) {
  const males = students.filter(s => s.gender === "1").length;
  const females = students.filter(s => s.gender === "2").length;
  document.getElementById("male-count").textContent = males;
  document.getElementById("female-count").textContent = females;
}

function logout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    localStorage.removeItem("user");
    window.location.href = "../html/login.html";
  }
}
