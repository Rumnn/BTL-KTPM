// Kiểm tra đăng nhập, nếu chưa login thì chuyển về login.html
window.onload = function () {
    if (!localStorage.getItem("user")) {
        window.location.href = "../html/login.html";
        return;
    }
    renderListStudent(); // hiển thị danh sách
};

function emailIsValid(email) {
    return /^\d{8}@st\.phenikaa-uni\.edu\.vn$/.test(email);
}

function save() {
    let fullname = document.getElementById('fullname').value;
    let code = document.getElementById('code').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let score = document.getElementById('score').value;
    let address = document.getElementById('address').value;
    let gender = '';

    if (document.getElementById('male').checked) {
        gender = document.getElementById('male').value;
    } else if (document.getElementById('famale').checked) {
        gender = document.getElementById('famale').value;
    }

    // Validate
    if (_.isEmpty(fullname) || fullname.trim().length <= 2 || fullname.trim().length > 50) {
        document.getElementById('fullname-error').innerHTML = 'Họ tên phải từ 3 đến 50 ký tự';
        fullname = '';
    } else {
        document.getElementById('fullname-error').innerHTML = '';
    }

    if (_.isEmpty(code) || code.trim().length !== 8) {
        document.getElementById('code-error').innerHTML = 'Mã sinh viên phải có đúng 8 ký tự';
        code = '';
    } else {
        document.getElementById('code-error').innerHTML = '';
    }

    if (_.isEmpty(email) || !emailIsValid(email)) {
        document.getElementById('email-error').innerHTML = 'Email không hợp lệ';
        email = '';
    } else {
        document.getElementById('email-error').innerHTML = '';
    }

    if (_.isEmpty(phone) || !/^\d{10}$/.test(phone.trim())) {
        document.getElementById('phone-error').innerHTML = 'Số điện thoại phải gồm 10 chữ số';
        phone = '';
    } else {
        document.getElementById('phone-error').innerHTML = '';
    }

    if (_.isEmpty(address)) {
        document.getElementById('address-error').innerHTML = 'Vui lòng nhập địa chỉ';
        address = '';
    } else {
        document.getElementById('address-error').innerHTML = '';
    }

    if (_.isEmpty(gender)) {
        document.getElementById('gender-error').innerHTML = 'Vui lòng chọn giới tính';
        gender = '';
    } else {
        document.getElementById('gender-error').innerHTML = '';
    }

    if (_.isEmpty(score) || isNaN(score) || score < 0 || score > 10) {
        document.getElementById('score-error').innerHTML = 'Điểm phải là số từ 0 đến 10';
        score = '';
    } else {
        document.getElementById('score-error').innerHTML = '';
    }

    if (fullname && code && email && phone && score && address && gender) {
        let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];
        let editId = document.getElementById('edit-id').value;

        if (editId !== '') {
            // Update sinh viên
            students[editId] = { fullname, code, email, phone, address, gender, score };
            document.getElementById('save-btn').innerText = 'Thêm mới';
            document.getElementById('edit-id').value = '';
        } else {
            // Kiểm tra trùng email khi thêm mới
            let emailExists = students.some(student => student.email === email);
            if (emailExists) {
                document.getElementById('email-error').innerHTML = 'Email đã tồn tại';
                return;
            }

            let phoneExists = students.some(student => student.phone === phone);
            if (phoneExists) {
                document.getElementById('phone-error').innerHTML = 'Số điện thoại đã tồn tại';
                return;
            }

            students.push({ fullname, code, email, phone, address, gender, score });
        }

        localStorage.setItem('students', JSON.stringify(students));
        clearForm();
        renderListStudent();
    }
}

function clearForm() {
    document.getElementById('fullname').value = '';
    document.getElementById('code').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('score').value = '';
    document.getElementById('address').value = '';
    document.getElementById('male').checked = false;
    document.getElementById('famale').checked = false;
    document.getElementById('edit-id').value = '';
    document.getElementById('save-btn').innerText = 'Thêm mới';
    document.getElementById('save-btn').innerText = 'Lưu';
}

function renderListStudent() {
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];

    let listContainer = document.getElementById('list-student');

    if (students.length === 0) {
        listContainer.style.display = 'none';
        document.getElementById('grid-students').innerHTML = ''; // clear bảng
        return;
    }

    listContainer.style.display = 'block';

    let tableContent = `<tr>
        <td width='20'>NO</td>
        <td>Họ và tên</td>
        <td>Mã sinh viên</td>
        <td>Email</td>
        <td>Điện thoại</td>
        <td>Điểm</td>
        <td>Giới tính</td>
        <td>Địa chỉ</td>
        <td>Hành động</td>
    </tr>`;

    students.forEach((student, index) => {
        let studentId = index;
        let genderLabel = parseInt(student.gender) === 1 ? 'Nam' : 'Nữ';

        tableContent += `<tr>
            <td>${index + 1}</td>
            <td>${student.fullname}</td>
            <td>${student.code}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.score || "0"}</td>
            <td>${genderLabel}</td>
            <td>${student.address}</td>
            <td>
                <a href="#" onclick='editStudent(${studentId})'>Sửa</a> | 
                <a href="#" onclick='deleteStudent(${studentId})'>Xóa</a> | 
                <a href="#" onclick='copyStudent(${studentId})'>Copy</a>
            </td>
        </tr>`;
    });

    document.getElementById('grid-students').innerHTML = tableContent;

    updateStatistics();
}

function deleteStudent(id) {
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];
    students.splice(id, 1);
    localStorage.setItem('students', JSON.stringify(students));
    renderListStudent();
    updateStatistics();
}

function editStudent(id) {
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];
    let student = students[id];

    document.getElementById('fullname').value = student.fullname;
    document.getElementById('code').value = student.code;
    document.getElementById('email').value = student.email;
    document.getElementById('phone').value = student.phone;
    document.getElementById('score').value = student.score;
    document.getElementById('address').value = student.address;

    if (parseInt(student.gender) === 1) {
        document.getElementById('male').checked = true;
    } else {
        document.getElementById('famale').checked = true;
    }

    document.getElementById('edit-id').value = id;
    document.getElementById('save-btn').innerText = 'Cập nhật';

    document.getElementById('add-popup').style.display = 'flex';
}

function copyStudent(id) {
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];
    let student = students[id];

    document.getElementById('fullname').value = student.fullname;
    document.getElementById('code').value = student.code; // <-- hiển thị mã sinh viên
    document.getElementById('email').value = student.email;
    document.getElementById('phone').value = student.phone;
    document.getElementById('score').value = student.score;
    document.getElementById('address').value = student.address;

    if (parseInt(student.gender) === 1) {
        document.getElementById('male').checked = true;
    } else {
        document.getElementById('famale').checked = true;
    }

    document.getElementById('edit-id').value = ''; // để đảm bảo đây là thêm mới
    document.getElementById('save-btn').innerText = 'Thêm mới';
}

function searchStudents() {
    const keyword = document.getElementById("search-input").value.toLowerCase();
    const genderFilter = document.getElementById("gender-filter").value;
    const students = JSON.parse(localStorage.getItem("students")) || [];

    const filtered = students.filter(student => {
        const matchText = (
            student.fullname.toLowerCase().includes(keyword) ||
            student.email.toLowerCase().includes(keyword) ||
            student.phone.includes(keyword)
        );

        const matchGender = genderFilter ? student.gender === genderFilter : true;

        return matchText && matchGender;
    });

    renderSearchResult(filtered);
}

function renderSearchResult(filteredStudents) {
    const table = document.getElementById("search-student-table");
    const resultDiv = document.getElementById("search-result");

    if (filteredStudents.length === 0) {
        resultDiv.style.display = "block";
        table.innerHTML = "<tr><td colspan='7'>Không tìm thấy sinh viên nào</td></tr>";
        return;
    }

    resultDiv.style.display = "block";

    let html = `<tr>
        <td>NO</td>
        <td>Họ và tên</td>
        <td>Mã sinh viên</td>
        <td>Email</td>
        <td>SĐT</td>
        <td>Điểm</td>
        <td>Giới tính</td>
        <td>Địa chỉ</td>
    </tr>`;

    filteredStudents.forEach((student, index) => {
        html += `<tr>
            <td>${index + 1}</td>
            <td>${student.fullname}</td>
            <td>${student.code}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.score}</td>
            <td>${student.gender == '1' ? 'Nam' : 'Nữ'}</td>
            <td>${student.address}</td>
        </tr>`;
    });

    table.innerHTML = html;
}

function logout() {
    // Xác nhận đăng xuất
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        // Xóa dữ liệu đăng nhập nếu có
        localStorage.removeItem("user");
        // Chuyển hướng về trang login
        window.location.href = "../html/login.html";
    }
}

function updateStatistics() {
    const students = getListStudent(); // Hàm này bạn đã dùng trong renderListStudent()
    const total = students.length;
    const males = students.filter(s => s.gender === "1").length;
    const females = students.filter(s => s.gender === "2").length;

    // Cập nhật lên giao diện
    document.getElementById("total-students").textContent = total;
    document.getElementById("male-count").textContent = males;
    document.getElementById("female-count").textContent = females;
}

function getListStudent() {
    return localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];
}

function togglePopup(id) {
    const element = document.getElementById(id);
    element.classList.toggle("popup-visible");
}

function showFormPanel() {
    document.getElementById("form-student-panel").style.display = "block";
}

function closeFormPanel() {
    document.getElementById("form-student-panel").style.display = "none";
}
