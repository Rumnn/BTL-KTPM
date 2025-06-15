function renderStatistics() {
  const students = JSON.parse(localStorage.getItem('students')) || [];

  const categories = {
    gioi: 0,
    kha: 0,
    trungbinh: 0,
    yeu: 0
  };

  students.forEach(sv => {
    const score = parseFloat(sv.score);
    if (score >= 8) categories.gioi++;
    else if (score >= 6.5) categories.kha++;
    else if (score >= 5) categories.trungbinh++;
    else categories.yeu++;
  });

  const total = students.length;

  // Hiển thị số lượng
  document.getElementById("total-students").textContent = total;
  document.getElementById("gioi").textContent = categories.gioi;
  document.getElementById("kha").textContent = categories.kha;
  document.getElementById("trungbinh").textContent = categories.trungbinh;
  document.getElementById("yeu").textContent = categories.yeu;

  // Biểu đồ tròn
  const ctx = document.getElementById('scoreChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Giỏi', 'Khá', 'Trung bình', 'Yếu'],
      datasets: [{
        label: 'Xếp loại',
        data: [
          categories.gioi,
          categories.kha,
          categories.trungbinh,
          categories.yeu
        ],
        backgroundColor: ['#28a745', '#007bff', '#ffc107', '#dc3545'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 23
            },
            color: '#000'
          }
        }
      }
    }
  });

  // Tính phần trăm
  const percent = total > 0 ? {
    gioi: ((categories.gioi / total) * 100).toFixed(1),
    kha: ((categories.kha / total) * 100).toFixed(1),
    trungbinh: ((categories.trungbinh / total) * 100).toFixed(1),
    yeu: ((categories.yeu / total) * 100).toFixed(1)
  } : { gioi: 0, kha: 0, trungbinh: 0, yeu: 0 };

  // Hiển thị phần trăm
  document.getElementById("excellent-percent").textContent = percent.gioi + "%";
  document.getElementById("good-percent").textContent = percent.kha + "%";
  document.getElementById("average-percent").textContent = percent.trungbinh + "%";
  document.getElementById("poor-percent").textContent = percent.yeu + "%";
}

function logout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    localStorage.removeItem("user");
    window.location.href = "../html/login.html";
  }
}

