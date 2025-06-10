function emailIsValid(email) {
    return /^\d{8}@st\.phenikaa-uni\.edu\.vn$/.test(email);
}

function save() {
    let fullname = document.getElementById('fullname').value;
    let code = document.getElementById('code').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
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

    if (fullname && code && email && phone && address && gender) {
        let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];
        let editId = document.getElementById('edit-id').value;

        if (editId !== '') {
            // Update sinh viên
            students[editId] = { fullname, code, email, phone, address, gender };
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

            students.push({ fullname, code, email, phone, address, gender });
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
    document.getElementById('address').value = '';
    document.getElementById('male').checked = false;
    document.getElementById('famale').checked = false;
    document.getElementById('edit-id').value = '';
    document.getElementById('save-btn').innerText = 'Thêm mới';
}

async function renderListStudent() {
    try {
        const response = await fetch('http://localhost:3000/students');
        if (!response.ok) throw new Error('Failed to fetch');

        const students = await response.json();
        const listContainer = document.getElementById('list-student');

        if (students.length === 0) {
            listContainer.style.display = 'none';
            document.getElementById('grid-students').innerHTML = '';
            return;
        }

        listContainer.style.display = 'block';

        let tableContent = `<tr>
      <td>NO</td>
      <td>Họ và tên</td>
      <td>Mã sinh viên</td>
      <td>Email</td>
      <td>Điện thoại</td>
      <td>Giới tính</td>
      <td>Địa chỉ</td>
      <td>Hành động</td>
    </tr>`;

        students.forEach((student, index) => {
            const genderLabel = student.gender === 'Nam' ? 'Nam' : 'Nữ';
            tableContent += `<tr>
        <td>${index + 1}</td>
        <td>${student.full_name}</td>
        <td>${student.student_id}</td>
        <td>${student.email}</td>
        <td>${student.phone}</td>
        <td>${genderLabel}</td>
        <td>${student.address || ''}</td>
        <td>
          <a href="#" onclick='editStudent("${student.student_id}")'>Sửa</a> | 
          <a href="#" onclick='deleteStudent("${student.student_id}")'>Xóa</a>
        </td>
      </tr>`;
        });

        document.getElementById('grid-students').innerHTML = tableContent;

    } catch (err) {
        console.error('Lỗi khi tải danh sách sinh viên:', err);
        alert('Không thể kết nối đến máy chủ.');
    }
}

function deleteStudent(id){
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : []; 
    students.splice(id, 1);
    localStorage.setItem('students', JSON.stringify(students));
    renderListStudent();
}

function editStudent(id) {
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];
    let student = students[id];

    document.getElementById('fullname').value = student.fullname;
    document.getElementById('code').value = student.code;
    document.getElementById('email').value = student.email;
    document.getElementById('phone').value = student.phone;
    document.getElementById('address').value = student.address;

    if (parseInt(student.gender) === 1) {
        document.getElementById('male').checked = true;
    } else {
        document.getElementById('famale').checked = true;
    }

    document.getElementById('edit-id').value = id;
    document.getElementById('save-btn').innerText = 'Cập nhật';
}

function copyStudent(id) {
    let students = localStorage.getItem('students') ? JSON.parse(localStorage.getItem('students')) : [];
    let student = students[id];

    document.getElementById('fullname').value = student.fullname;
    document.getElementById('code').value = student.code; // <-- hiển thị mã sinh viên
    document.getElementById('email').value = student.email;
    document.getElementById('phone').value = student.phone;
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
    const keyword = document.getElementById("search-keyword").value.toLowerCase();
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
        resultDiv.style.display = "none";
        table.innerHTML = "";
        return;
    }

    resultDiv.style.display = "block";

    let html = `<tr>
        <td>NO</td>
        <td>Họ và tên</td>
        <td>Mã sinh viên</td>
        <td>Email</td>
        <td>SĐT</td>
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
            <td>${student.gender == '1' ? 'Nam' : 'Nữ'}</td>
            <td>${student.address}</td>
        </tr>`;
    });

    table.innerHTML = html;
}
