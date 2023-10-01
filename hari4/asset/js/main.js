function kirim() {
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const hp = document.getElementById("hp").value
    const subject = document.getElementById("subject").value
    const pesan = document.getElementById("pesan").value

    if (name == "") {
        return alert("Isi nama terlebih dahulu")
    } else if (email == "") {
        return alert("Isi email terlebih dahulu")
    } else if (hp == "") {
        return alert("Isi nomor telpon terlebih dahulu")
    } else if (subject == "") {
        return alert("Isi nubject terlebih dahulu")
    } else if (pesan == "") {
        return alert("Isi pesan terlebih dahulu")
    }

    const sendto = "citospro@gmail.com"
    let a = document.createElement("a")
    a.href = `mailto:${emailReceiver}?subject=${subject}&body= Halo nama saya ${name} , bisakah anda menghubungi saya ${hp} untuk membahas project ${pesan}`
    a.click()

    let data = {
        name,
        email,
        hp,
        subject,
        pesan
    }

    console.log(data)
}