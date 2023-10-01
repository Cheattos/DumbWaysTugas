const data = []

function submitData(event) {
    event.preventDefault()

    let pjname = document.getElementById("pjname").value
    let startdate = document.getElementById("startdate").value
    let enddate = document.getElementById("enddate").value
    let description = document.getElementById("description").value
    // let nodejs = document.getElementById("nodejs").value
    // let rectjs = document.getElementById("rectjs").value
    // let nextjs = document.getElementById("nextjs").value
    // let typeScript = document.getElementById("typeScript").value
    let upfile = document.getElementById("upfile").files

    upfile = URL.createObjectURL(upfile[0])

    function SaveCheckbox() {
        const SaveBox = [];

        const reactjsCheckbox = document.getElementById('reactjsCheckbox');
        if (reactjsCheckbox.checked) {
            SaveBox.push('ReactJS');
        }

        const nodejsCheckbox = document.getElementById('nodejsCheckbox');
        if (nodejsCheckbox.checked) {
            SaveBox.push('Node.js');
        }

        const typescriptCheckbox = document.getElementById('typescriptCheckbox');
        if (typescriptCheckbox.checked) {
            SaveBox.push('TypeScript');
        }

        const nextjsCheckbox = document.getElementById('nextjsCheckbox');
        if (nextjsCheckbox.checked) {
            SaveBox.push('Next.js');
        }

        return SaveBox;
    }

    let cb = SaveCheckbox();

    const obj = {
        pjname,
        startdate,
        enddate,
        description,
        
        typeScript,
        upfile,
    }

    data.push(obj)
    renderBlog()
}


function renderBlog() {
    document.getElementById("contents").innerHTML = ""

    for (let i = 0; i < data.length; i++) {
        document.getElementById("contents").innerHTML +=
            `< div class="container2" >
        <p>MY PROJECT</p>
        <div
            style="width: auto; border-radius: 7px; box-shadow: 0 15px 40px rgb(207, 207, 207); margin-top:5px; margin-left: 5%; margin-right: 5%;">
            <img src="${data[i].upfile}" alt="fotoKeren"
                style="border-radius: 7px 7px 0 0; width:100%; height: 330px;">
            <div style="text-align: center; margin-top:-15px; height: 300px;">
                <h3>Project Name</h3>
                <p>durasi : ${data[i].startdate} - ${data[i].enddate}</p><br>

                <p>${data[i].description}</p><br><br>
                

                <br><br>
                <button>a</button>
                <button>b</button>
            </div>
        </div>
    </div>`
    }
}



