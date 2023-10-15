const data = [];

function submitData(event) {
    event.preventDefault();

    let pjname = document.getElementById("pjname").value;
    let startdateInput = document.getElementById("startdate").value;
    let enddateInput = document.getElementById("enddate").value;
    let description = document.getElementById("description").value;
    let upfile = document.getElementById("upfile").files[0];

    // Validasi input tanggal
    if (!isValidDate(startdateInput) || !isValidDate(enddateInput)) {
        alert("Format tanggal tidak valid.");
        return;
    }

    // Mengonversi input tanggal menjadi objek Date
    let startdate = new Date(startdateInput);
    let enddate = new Date(enddateInput);

    function saveCheckbox() {
        const saveBox = [];

        const reactjsCheckbox = document.getElementById('reactjsCheckbox');
        if (reactjsCheckbox.checked) {
            saveBox.push('<i class="fa-brands fa-react fa" style="color: #000000;"> React Js</i>');
        }

        const nodejsCheckbox = document.getElementById('nodejsCheckbox');
        if (nodejsCheckbox.checked) {
            saveBox.push('<i class="fa-brands fa-node-js fa" style="color: #000000;"> Node Js</i>');
        }

        const typescriptCheckbox = document.getElementById('typescriptCheckbox');
        if (typescriptCheckbox.checked) {
            saveBox.push('<i class="fa-brands fa-square-js fa">Typescript</i>');
        }

        const nextjsCheckbox = document.getElementById('nextjsCheckbox');
        if (nextjsCheckbox.checked) {
            saveBox.push('<i class="fa-brands fa-rocketchat fa">Next JS</i>');
        }

        return saveBox;
    }

    let technologies = saveCheckbox();

    // Menghitung durasi dalam milidetik
    let duration = enddate - startdate;

    // Menghitung tahun, bulan, dan hari
    let years = enddate.getFullYear() - startdate.getFullYear();
    let months = enddate.getMonth() - startdate.getMonth();
    let days = enddate.getDate() - startdate.getDate();
    let hours = Math.floor(duration / (1000 * 60 * 60));
    let minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    // Menghitung durasi akhir dalam format yang sesuai
    let durationString = "";
    if (years > 0) {
        durationString = years + " year";
    } else if (months > 0) {
        durationString = months + " month";
    } else if (days > 0) {
        durationString = days + " day";
    } else if (hours > 0) {
        durationString = hours + " hour";
    } else if (minutes > 0) {
        durationString = minutes + " minute";
    }

    const obj = {
        pjname,
        startdate: startdate.toLocaleDateString(),
        enddate: enddate.toLocaleDateString(),
        duration: durationString,
        description,
        technologies,
        upfile: URL.createObjectURL(upfile),
    };

    data.push(obj);
    renderBlog();
}

function isValidDate(dateString) {
    // Validasi format tanggal dengan regular expression
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return datePattern.test(dateString);
}

// function renderBlog() {
//     const contents = document.getElementById("contents");
//     contents.innerHTML = "";

//     for (let i = 0; i < data.length; i++) {
//         contents.innerHTML += `
//         <td>
//         <div
//         style="width: auto; border-radius: 7px; box-shadow: 0 15px 40px rgb(207, 207, 207); margin-top:5px; margin-left: 5%; margin-right: 5%;">
//         <img src="${data[i].upfile}" alt="fotoKeren"
//             style="border-radius: 7px 7px 0 0; width:100%; height: 330px;">
//         <div style="text-align: center; margin-top:-15px; height: 300px;">
//             <h3>${data[i].pjname}</h3>
//             <p>durasi : ${data[i].startdate} - ${data[i].enddate} (${data[i].duration})</p><br>

//             <p>${data[i].description}</p><br><br>
//             <p>${data[i].technologies.join(', ')}</p>
//         </div>
//     </div>
//     </td>
//         `;
//     }
// }


function renderBlog() {
    const contents = document.getElementById("contents");
    contents.innerHTML = "";

    let currentRow;
    for (let i = 0; i < data.length; i++) {
        if (i % 4 === 0) {
            currentRow = document.createElement("tr");
            contents.appendChild(currentRow);
        }

        const cell = document.createElement("td");
        cell.innerHTML = `
            <div style="width: auto; border-radius: 7px; box-shadow: 0 15px 40px rgb(207, 207, 207); margin-top:5px; margin-left: 5%; margin-right: 5%;">
            <td>
            <img src="${data[i].upfile}" alt="fotoKeren"
            style="border-radius: 7px 7px 0 0; width:100%; height: 330px;">
        <div style="text-align: center; margin-top:-15px; height: 300px;">
            <h3>${data[i].pjname}</h3>
            <p>durasi : ${data[i].startdate} - ${data[i].enddate} (${data[i].duration})</p><br>
    
            <p>${data[i].description}</p><br><br>
            <p>${data[i].technologies.join(', ')}</p>
        </div>
            </td>
            </div>
        `;
        currentRow.appendChild(cell);
    }
}

function toggleMenu() {
    var listmenu = document.getElementById("listmenu");

    if (listmenu.style.display === "none" || listmenu.style.display === "") {
        listmenu.style.display = "block";
    } else {
        listmenu.style.display = "none";
    }
}


function deleteBlog(id) {
    if (confirm("Are you sure you want to delete this entry?")) {
        // Send a request to the server to delete the entry by ID
        fetch(`/delete/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.status === 200) {
                    // If the delete is successful, refresh the page
                    location.reload();
                } else {
                    console.error("Failed to delete the entry.");
                }
            })
            .catch(error => {
                console.error("Failed to delete the entry.", error);
            });
    }
}




