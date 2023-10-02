const data = [];

function submitData(event) {
    event.preventDefault();

    let pjname = document.getElementById("pjname").value;
    let startdate = document.getElementById("startdate").value;
    let enddate = document.getElementById("enddate").value;
    let description = document.getElementById("description").value;
    let upfile = document.getElementById("upfile").files[0];

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

    const obj = {
        pjname,
        startdate,
        enddate,
        description,
        technologies,
        upfile: URL.createObjectURL(upfile),
    };

    data.push(obj);
    renderBlog();
}

function renderBlog() {
    const contents = document.getElementById("contents");
    contents.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        contents.innerHTML += `
        <td>
        <div
        style="width: auto; border-radius: 7px; box-shadow: 0 15px 40px rgb(207, 207, 207); margin-top:5px; margin-left: 5%; margin-right: 5%;">
        <img src="${data[i].upfile}" alt="fotoKeren"
            style="border-radius: 7px 7px 0 0; width:100%; height: 330px;">
        <div style="text-align: center; margin-top:-15px; height: 300px;">
            <h3>${data[i].pjname}</h3>
            <p>durasi : ${data[i].startdate} - ${data[i].enddate}</p><br>
    
            <p>${data[i].description}</p><br><br>
            <p>${data[i].technologies.join(', ')}</p>
        </div>
    </div>
    <td>
        `;
    }
}
