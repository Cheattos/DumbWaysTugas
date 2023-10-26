const express = require('express')
const path = require('path')
const blogss = require('./public/asset/mocks/blogss.json')
const app = express()
const PORT = 5000
const formidable = require('formidable');
const fs = require('fs');
const hbs = require('hbs');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')
const upload = require('./middlewares/uploadFile')
const Blog = require('./models/myblog');

//viewdb
const config = require('./config/config.json')
const { Sequelize, QueryTypes } = require("sequelize")
const sequelize = new Sequelize(config.development)

// setup to call hbs 
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'src/view'))

// set static file server
app.use(express.static('public/asset'))
app.use(express.static('public/asset/uploads'))

// parsing data from client
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// local server
app.listen(PORT, () => {
    console.log("Server running on port 5000");
})

// setup flash
app.use(flash())

// setup session express
app.use(session({
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 2
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: 'dandiganteng'
})
)

app.get('/', home)
app.get('/yublog', yublog)
app.get('/contact', contact)
app.get('/login', login)
app.get('/myproject', myproject)
app.get('/testimoni', testimoni)
app.get('/addblog', addblog)
app.get('/myblog', myblog)
app.get('/formmyblog', formmyblog)
app.post('/addmyblog', upload.single('upfile'), addmyblog)
app.post('/blogsubmit', blogsubmit)
app.post('/update/:id', update)
app.get('/edit/:id', editBlog);
app.delete('/delete/:id', deleteBlog);

// fuction routing
function home(req, res) {
    res.render('index')
}

function login(req, res) {
    res.render('login')
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

function myblog(req, res) {
    res.render('myblog')
}

function formmyblog(req, res) {
    res.render('formmyblog')
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

// function calculateDateDuration(startdate, enddate) {
//     const startDate = new Date(startdate);
//     const endDate = new Date(enddate); 

//     if (startDate.getTime() === endDate.getTime()) {
//         return "Tanggal mulai dan tanggal akhir sama.";
//     }

//     const yearsDifference = endDate.getUTCFullYear() - startDate.getUTCFullYear();
//     const monthsDifference = endDate.getUTCMonth() - startDate.getUTCMonth(); 
//     const daysDifference = endDate.getUTCDate() - startDate.getUTCDate();

//     if (daysDifference < 0) {
//         const daysInLastMonth = new Date(
//             endDate.getUTCFullYear(),
//             endDate.getUTCMonth(),
//         ).getUTCDate();
//         daysDifference += daysInLastMonth;
//     }

//     if (monthsDifference < 0) {
//         yearsDifference--;
//         monthsDifference += 12;
//     }

//     let duration = "";

//     if (yearsDifference > 0) {
//         duration += yearsDifference > 1 ? `${yearsDifference} tahun` : `${yearsDifference} tahun`;
//     }

//     if (monthsDifference > 0) {
//         duration += duration ? (yearsDifference > 0 ? " " : "") : "";
//         duration += monthsDifference > 1 ? `${monthsDifference} bulan` : `${monthsDifference} bulan`;
//     }

//     if (daysDifference > 0) {
//         duration += duration ? (monthsDifference > 0 || yearsDifference > 0 ? " " : "") : "";
//         duration += daysDifference > 1 ? `${daysDifference} hari` : `${daysDifference} hari`;
//     }

//     return duration;
// }

function blogsubmit(req, res) {
    const id = uuidv4();
    const { projectname, startdate, enddate, description, selectedTechnologies } = req.body;
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
        projectname,
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
    const { projectname, startdate, enddate, description, selectedTechnologies } = req.body;

    // Temukan proyek yang sesuai berdasarkan projectId
    const projectToUpdate = blogss.find(project => project.id === projectId);

    if (!projectToUpdate) {
        return res.status(404).json({ error: 'Proyek tidak ditemukan' });
    }

    // Lakukan pembaruan data proyek
    projectToUpdate.projectname = projectname;
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

async function addmyblog(req, res) {
    try {
        const { projectname, startdate, enddate, description, selectedTechnologies } = req.body;
        const images = req.file.filename

        // Menghitung duration menggunakan fungsi calculateDateDuration
        const duration = calculateDateDuration(startdate, enddate);

        // Mengonversi teknologi menjadi format yang sesuai untuk basis data PostgreSQL
        const technologiesArray = selectedTechnologies.map(tech => `'${tech}'`).join(', ');

        const query = `
            INSERT INTO myblogs (projectname, startdate, enddate, "desc", technologies, images, duration, "createdAt", "updatedAt")
            VALUES ('${projectname}', '${startdate}', '${enddate}', '${description}', ARRAY[${technologiesArray}], '${images}', '${duration}', NOW(), NOW())
        `;

        await sequelize.query(query);

        res.redirect('/myblog');
    } catch (error) {
        console.log(error);
    }
}


