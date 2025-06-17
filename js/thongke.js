// thongke.js - dùng lại biểu đồ Chart.js tương tác

window.onload = function () {
  if (!localStorage.getItem("user")) {
    window.location.href = "../html/login.html";
    return;
  }
  renderClassOptions();
};

function renderClassOptions() {
  const classes = JSON.parse(localStorage.getItem("classes") || "[]");
  const selector = document.getElementById("class-selector");
  const currentClass = localStorage.getItem("currentClass") || "";

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
    renderStatistics();
  };

  renderStatistics();
}

function renderStatistics() {
  const allStudents = JSON.parse(localStorage.getItem("students") || "[]");
  const selectedClass = localStorage.getItem("currentClass") || "";
  const students = allStudents.filter(s => s.className === selectedClass);

  document.getElementById("total-students").textContent = students.length;

  let gioi = 0, kha = 0, tb = 0, yeu = 0;
  students.forEach(sv => {
    const score = parseFloat(sv.score);
    if (score >= 8.5) gioi++;
    else if (score >= 7) kha++;
    else if (score >= 5) tb++;
    else yeu++;
  });

  document.getElementById("gioi-count").textContent = gioi;
  document.getElementById("kha-count").textContent = kha;
  document.getElementById("tb-count").textContent = tb;
  document.getElementById("yeu-count").textContent = yeu;

  const total = students.length || 1;
  document.getElementById("gioi-pct").textContent = `${((gioi / total) * 100).toFixed(1)}%`;
  document.getElementById("kha-pct").textContent = `${((kha / total) * 100).toFixed(1)}%`;
  document.getElementById("tb-pct").textContent = `${((tb / total) * 100).toFixed(1)}%`;
  document.getElementById("yeu-pct").textContent = `${((yeu / total) * 100).toFixed(1)}%`;

  drawChart(gioi, kha, tb, yeu);
}

function drawChart(gioi, kha, tb, yeu) {
  const total = gioi + kha + tb + yeu;
  const ctx = document.getElementById("chart").getContext("2d");
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Giỏi", "Khá", "Trung bình", "Yếu"],
      datasets: [{
        data: [gioi, kha, tb, yeu],
        backgroundColor: ["#2ecc71", "#3498db", "#f1c40f", "#e74c3c"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw;
              const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${context.label}: ${value} (${percent}%)`;
            }
          }
        }
      }
    }
  });
}

function logout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    localStorage.removeItem("user");
    window.location.href = "../html/login.html";
  }
}
