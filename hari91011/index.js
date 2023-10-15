const express = require('express')
const path = require('path')
const blogss = require('./public/asset/mocks/blogss.json')
const app = express()
const PORT = 5000
const formidable = require('formidable');
const fs = require('fs');
const hbs = require('hbs');
const { v4: uuidv4 } = require('uuid');



// setup to call hbs 
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'src/view'))

// set static file server
app.use(express.static('public/asset'))

// parsing data from client
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// local server
app.listen(PORT, () => {
    console.log("Server running on port 5000");
})

app.get('/', home)
app.get('/yublog', yublog)
app.get('/contact', contact)
app.get('/myproject', myproject)
app.get('/testimoni', testimoni)
app.get('/addblog', addblog)
app.post('/blogsubmit', blogsubmit)
app.post('/update/:id', update)
app.get('/edit/:id', editBlog);
app.delete('/delete/:id', deleteBlog);

// fuction routing
function home(req, res) {
    res.render('index')
}

function contact(req, res) {
    res.render('contact')
}

function myproject(req, res) {
    res.render('myproject')
}

function testimoni(req, res) {
    res.render('testimoni')
}

function yublog(req, res) {
    res.render('yublog', { blogss: blogss })
}

function addblog(req, res) {
    res.render('addblog')
}

hbs.registerHelper('inArray', function (value, array) {
    return array.includes(value);
});

function editBlog(req, res) {
    const id = parseInt(req.params.id);
    if (id >= 0 && id < blogss.length) {
        const blog = blogss[id];
        res.render('editblog', { blog });
    } else {
        res.status(404).send("Blog not found");
    }
}

function deleteBlog(req, res) {
    const id = parseInt(req.params.id);
    if (id >= 0 && id < blogss.length) {
        blogss.splice(id, 1); // Remove the entry with the given ID
        fs.writeFile('./public/asset/mocks/blogss.json', JSON.stringify(blogss, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to delete the entry' });
            }
            res.sendStatus(200);
        });
    } else {
        res.status(404).json({ error: 'Blog not found' });
    }
}

function calculateDateDuration(startdate, enddate) {
    const startDate = new Date(startdate); //2023-01-15
    const endDate = new Date(enddate); //2024-01-01

    if (startDate.getTime() === endDate.getTime()) {
        return "Tanggal mulai dan tanggal akhir sama.";
    }

    const yearsDifference = endDate.getUTCFullYear() - startDate.getUTCFullYear(); //2024-2023 =1
    const monthsDifference = endDate.getUTCMonth() - startDate.getUTCMonth(); //1-1 = 0
    const daysDifference = endDate.getUTCDate() - startDate.getUTCDate(); //15-1= -14

    if (daysDifference < 0) { //karena -14 lebih kecil dari 0 maka akan disekusi
        const daysInLastMonth = new Date( //sepeti array bulan dimulai dari 0 sehingga januari-desember menjadi 0-11
            endDate.getUTCFullYear(), //tahun endate yaitu 2023
            endDate.getUTCMonth(), //1 bulan sebelum bulan pada endate yaitu desember
            0 //untuk menampung hari
        ).getUTCDate(); //2023-desember-31
        daysDifference += daysInLastMonth; //-14+31 = 17
    }

    if (monthsDifference < 0) { //dijalankan jika bulan monthsDifference mendapatkan hasil minus, misal bulan
        // startdate 2, endadate 8 jadi 2-8=-6
        yearsDifference--; //tahun hasil pengurangan di kurangin lagi
        monthsDifference += 12;
    }

    let duration = "";

    if (yearsDifference > 0) {
        duration += yearsDifference > 1 ? `${yearsDifference} tahun` : `${yearsDifference} tahun`;
    }

    if (monthsDifference > 0) {
        duration += duration ? (yearsDifference > 0 ? " " : "") : ""; //ternari dimana jika string duration tidak kosong
        //atau kondisi yearsDifference sudah ada maka akan ditambahkan nilai spasi, tapi jika ternari(?) kosong maka string 
        //duration tidak akan ditambahkan string spasi
        duration += monthsDifference > 1 ? `${monthsDifference} bulan` : `${monthsDifference} bulan`;
    }

    if (daysDifference > 0) {
        duration += duration ? (monthsDifference > 0 || yearsDifference > 0 ? " " : "") : "";
        duration += daysDifference > 1 ? `${daysDifference} hari` : `${daysDifference} hari`;
    }

    return duration;
}

function blogsubmitAwal(req, res) {
    const { pjname, startdate, enddate, description } = req.body

    const duration = calculateDateDuration(startdate, enddate);

    const data = {
        pjname,
        startdate,
        enddate,
        duration: `${duration}`,
        technologies: "uhuybadahfbajhfvwajuhfvbawjfhvabwfjhwavbfjhwafvajhfvawjhfva",
        description,
    }


    blogss.unshift(data)

    fs.writeFile('./public/asset/mocks/blogss.json', JSON.stringify(blogss, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Gagal menyimpan data' });
        }

        res.redirect('/yublog');
    });
}

function blogsubmit(req, res) {
    const id = uuidv4();
    const { pjname, startdate, enddate, description, selectedTechnologies } = req.body;
    const technologies = [];

    if (Array.isArray(selectedTechnologies)) {
        if (selectedTechnologies.includes("Node JS")) {
            technologies.push('Node JS');
        }
        if (selectedTechnologies.includes("React JS")) {
            technologies.push('React JS');
        }
        if (selectedTechnologies.includes("Next JS")) {
            technologies.push('Next JS');
        }
        if (selectedTechnologies.includes("TypeScript")) {
            technologies.push('TypeScript');
        }
    }


    const duration = calculateDateDuration(startdate, enddate);

    const data = {
        id,
        pjname,
        startdate,
        enddate,
        duration: `${duration}`,
        technologies,
        description,
    };

    blogss.unshift(data);

    // Simpan data ke file blogss.json
    fs.writeFile('./public/asset/mocks/blogss.json', JSON.stringify(blogss, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Gagal menyimpan data' });
        }

        res.redirect('/yublog');
    });
}

function update(req, res) {
    const projectId = req.params.id;
    const { pjname, startdate, enddate, description, selectedTechnologies } = req.body;

    // Temukan proyek yang sesuai berdasarkan projectId
    const projectToUpdate = blogss.find(project => project.id === projectId);

    if (!projectToUpdate) {
        return res.status(404).json({ error: 'Proyek tidak ditemukan' });
    }

    // Lakukan pembaruan data proyek
    projectToUpdate.pjname = pjname;
    projectToUpdate.startdate = startdate;
    projectToUpdate.enddate = enddate;
    projectToUpdate.description = description;

    // Hapus teknologi yang lama dan tambahkan yang baru
    projectToUpdate.technologies = [];
    if (Array.isArray(selectedTechnologies)) {
        if (selectedTechnologies.includes("Node JS")) {
            projectToUpdate.technologies.push('Node JS');
        }
        if (selectedTechnologies.includes("React JS")) {
            projectToUpdate.technologies.push('React JS');
        }
        if (selectedTechnologies.includes("Next JS")) {
            projectToUpdate.technologies.push('Next JS');
        }
        if (selectedTechnologies.includes("TypeScript")) {
            projectToUpdate.technologies.push('TypeScript');
        }
    }

    // Hitung ulang durasi dan simpan
    projectToUpdate.duration = calculateDateDuration(startdate, enddate);

    // Simpan data yang telah diperbarui ke file blogss.json
    fs.writeFile('./public/asset/mocks/blogss.json', JSON.stringify(blogss, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Gagal menyimpan data' });
        }

        res.redirect('/yublog');
    });
}

function blogsubmitGambar(req, res) {
    const form = new formidable.IncomingForm({
        uploadDir: './public/asset/gambar/', // Direktori penyimpanan file gambar
        keepExtensions: true, // Menyimpan ekstensi asli file
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Gagal menyimpan data' });
        }

        const { pjname, startdate, enddate, description, selectedTechnologies } = fields;

        const technologies = [];

        if (Array.isArray(selectedTechnologies)) {
            if (selectedTechnologies.includes("Node JS")) {
                technologies.push('React Js');
            }
            if (selectedTechnologies.includes("React JS")) {
                technologies.push('Node Js');
            }
            if (selectedTechnologies.includes("Next JS")) {
                technologies.push('Typescript');
            }
            if (selectedTechnologies.includes("TypeScript")) {
                technologies.push('Next JS');
            }
        }

        const duration = calculateDateDuration(startdate, enddate);

        // Simpan alamat file gambar dalam objek data
        const imagePath = files.upfile ? files.upfile.path : null;

        const data = {
            pjname,
            startdate,
            enddate,
            duration: `${duration}`,
            technologies,
            description,
            image: imagePath, // Menambahkan alamat file gambar ke data
        };

        blogss.unshift(data);

        // Simpan data ke file blogss.json
        fs.writeFile('./public/asset/mocks/blogss.json', JSON.stringify(blogss, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Gagal menyimpan data' });
            }

            res.redirect('/yublog');
        });
    });
}


