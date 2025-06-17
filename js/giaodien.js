// Hiển thị popup thêm lớp
function openPopup() {
  document.getElementById("class-popup").style.display = "flex";
  document.getElementById("class-form").reset();
  document.getElementById("popup-title").innerText = "Thêm lớp học mới";
  document.getElementById("edit-index").value = "";
}

// Đóng popup
function closePopup() {
  document.getElementById("class-popup").style.display = "none";
}

// Gửi form
document.getElementById("class-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const maLop = document.getElementById("maLop").value;
  const tenLop = document.getElementById("tenLop").value;
  const hocPhan = document.getElementById("hocPhan").value;
  const kyHoc = document.getElementById("kyHoc").value;
  const soSV = document.getElementById("soSV").value;
  const trangThai = document.getElementById("trangThai").value;

  const classes = JSON.parse(localStorage.getItem("classes") || "[]");

  const editIndex = document.getElementById("edit-index").value;
  if (editIndex !== "") {
    classes[editIndex] = { maLop, tenLop, hocPhan, kyHoc, soSV, trangThai };
  } else {
    classes.push({ maLop, tenLop, hocPhan, kyHoc, soSV, trangThai });
  }

  localStorage.setItem("classes", JSON.stringify(classes));
  closePopup();
  renderClassList();
});

// Hiển thị danh sách lớp học
function renderClassList() {
  const classes = JSON.parse(localStorage.getItem("classes") || "[]");
  const tbody = document.querySelector("#class-table tbody");
  const filterSemester = document.getElementById("filter-semester").value.trim();
  const keyword = document.querySelector(".actions input").value.trim().toLowerCase();

  tbody.innerHTML = "";

  let tongSV = 0;
  let dangMo = 0;
  let hocPhanSet = new Set();

  classes.forEach((cls, index) => {
    const matchSemester = !filterSemester || cls.kyHoc === filterSemester;
    const matchKeyword = !keyword || cls.maLop.toLowerCase().includes(keyword) || cls.tenLop.toLowerCase().includes(keyword);

    if (matchSemester && matchKeyword) {
      tongSV += parseInt(cls.soSV);
      if (cls.trangThai === "ĐANG MỞ") dangMo++;
      hocPhanSet.add(cls.hocPhan);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${cls.maLop}</strong></td>
        <td>${cls.tenLop}</td>
        <td>${cls.hocPhan}</td>
        <td><span class="badge blue">${cls.kyHoc}</span></td>
        <td><span class="badge purple">${cls.soSV} SV</span></td>
        <td><span class="badge ${cls.trangThai === 'ĐANG MỞ' ? 'green' : 'red'}">${cls.trangThai}</span></td>
        <td>
          <button class="action-btn edit" onclick="editClass(${index})"><i class="fas fa-pen"></i></button>
          <button class="action-btn delete" onclick="deleteClass(${index})"><i class="fas fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    }
  });

  document.getElementById("total-class").textContent = classes.length;
  document.getElementById("total-student").textContent = tongSV;
  document.getElementById("open-class").textContent = dangMo;
  document.getElementById("total-subject").textContent = hocPhanSet.size;
}

// Xoá lớp
function deleteClass(index) {
  if (!confirm("Bạn có chắc muốn xóa lớp này?")) return;
  const classes = JSON.parse(localStorage.getItem("classes") || "[]");
  classes.splice(index, 1);
  localStorage.setItem("classes", JSON.stringify(classes));
  renderClassList();
}

// Sửa lớp
function editClass(index) {
  const classes = JSON.parse(localStorage.getItem("classes") || "[]");
  const cls = classes[index];

  document.getElementById("maLop").value = cls.maLop;
  document.getElementById("tenLop").value = cls.tenLop;
  document.getElementById("hocPhan").value = cls.hocPhan;
  document.getElementById("kyHoc").value = cls.kyHoc;
  document.getElementById("soSV").value = cls.soSV;
  document.getElementById("trangThai").value = cls.trangThai;
  document.getElementById("edit-index").value = index;

  document.getElementById("popup-title").innerText = "Chỉnh sửa lớp học";
  document.getElementById("class-popup").style.display = "flex";
}

// Đăng xuất
function logout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    localStorage.removeItem("user");
    window.location.href = "../html/login.html";
  }
}